"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkCredentials, createSession, destroySession, isAdmin } from "./auth";
import { prisma, slugify } from "./db";
import { clean, toHtml } from "./content";

const RESERVED = ["admin", "wiki", "api", "privacy", "cookie", "login"];

async function guard() { if (!(await isAdmin())) redirect("/admin/login"); }
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (f: FormData, k: string) => Number(f.get(k)) || 0;
const lang = (f: FormData) => (str(f, "lang") === "en" ? "en" : "it");
const refresh = () => { revalidatePath("/wiki", "layout"); revalidatePath("/admin", "layout"); };

export async function login(_: string | null, f: FormData) {
  await new Promise((r) => setTimeout(r, 600)); // rallenta i tentativi
  if (!checkCredentials(str(f, "user"), String(f.get("pass") ?? ""))) return "Credenziali non valide";
  await createSession();
  redirect("/admin");
}
export async function logout() { await destroySession(); redirect("/admin/login"); }

export async function createSection(f: FormData) {
  await guard();
  const title = str(f, "title"); if (!title) return;
  let slug = slugify(title); if (RESERVED.includes(slug)) slug += "-1";
  const max = await prisma.section.aggregate({ _max: { position: true } });
  try {
    await prisma.section.create({ data: { title, slug, position: (max._max.position ?? 0) + 1, icon: str(f, "icon") || "book", lang: lang(f), key: str(f, "key") || null } });
  } catch { /* slug già esistente */ }
  refresh();
}
export async function renameSection(f: FormData) {
  await guard();
  const title = str(f, "title"); if (!title) return;
  await prisma.section.update({ where: { id: num(f, "id") }, data: { title, icon: str(f, "icon") || "book", lang: lang(f), key: str(f, "key") || null } });
  refresh();
}
export async function deleteSection(f: FormData) {
  await guard();
  await prisma.section.delete({ where: { id: num(f, "id") } }).catch(() => {});
  refresh();
}
export async function createPage(f: FormData) {
  await guard();
  const title = str(f, "title"), sectionId = num(f, "section_id"); if (!title) return;
  const max = await prisma.page.aggregate({ where: { sectionId }, _max: { position: true } });
  let id: number;
  try {
    id = (await prisma.page.create({ data: { sectionId, title, slug: slugify(title), content: "", position: (max._max.position ?? 0) + 1 } })).id;
  } catch { return; }
  refresh();
  redirect(`/admin/page/${id}`);
}
export async function savePage(f: FormData) {
  await guard();
  const id = num(f, "id"), title = str(f, "title");
  if (!title) return;
  try {
    await prisma.page.update({
      where: { id },
      data: {
        title, slug: slugify(str(f, "slug") || title), content: clean(toHtml(String(f.get("content") ?? ""))),
        published: !!f.get("published"), position: num(f, "position"), key: str(f, "key") || null,
      },
    });
  } catch { redirect(`/admin/page/${id}?err=slug`); }
  refresh();
  redirect(`/admin/page/${id}?saved=1`);
}
export async function deletePage(f: FormData) {
  await guard();
  await prisma.page.delete({ where: { id: num(f, "id") } }).catch(() => {});
  refresh();
  redirect("/admin");
}

// --- ordinamento e stato ---
const dirOf = (f: FormData) => (str(f, "dir") === "up" ? -1 : 1);
function swap<T extends { id: number }>(list: T[], id: number, d: number) {
  const i = list.findIndex((x) => x.id === id), j = i + d;
  if (i < 0 || j < 0 || j >= list.length) return null;
  [list[i], list[j]] = [list[j], list[i]];
  return list;
}
export async function moveSection(f: FormData) {
  await guard();
  const cur = await prisma.section.findUnique({ where: { id: num(f, "id") }, select: { lang: true } });
  if (!cur) return;
  // l'ordine è per lingua: si scambia solo tra gruppi della stessa lingua
  const list = swap(await prisma.section.findMany({ where: { lang: cur.lang }, orderBy: [{ position: "asc" }, { title: "asc" }], select: { id: true } }), num(f, "id"), dirOf(f));
  if (list) await prisma.$transaction(list.map((x, k) => prisma.section.update({ where: { id: x.id }, data: { position: k + 1 } })));
  refresh();
}
export async function movePage(f: FormData) {
  await guard();
  const cur = await prisma.page.findUnique({ where: { id: num(f, "id") }, select: { sectionId: true } });
  if (!cur) return;
  const pages = await prisma.page.findMany({ where: { sectionId: cur.sectionId }, orderBy: [{ position: "asc" }, { title: "asc" }], select: { id: true, updatedAt: true } });
  const list = swap(pages, num(f, "id"), dirOf(f));
  // updatedAt viene mantenuto: riordinare non conta come modifica del contenuto
  if (list) await prisma.$transaction(list.map((x, k) => prisma.page.update({ where: { id: x.id }, data: { position: k + 1, updatedAt: x.updatedAt } })));
  refresh();
}
export async function togglePublished(f: FormData) {
  await guard();
  const pg = await prisma.page.findUnique({ where: { id: num(f, "id") } });
  if (pg) await prisma.page.update({ where: { id: pg.id }, data: { published: !pg.published, updatedAt: pg.updatedAt } });
  refresh();
}
