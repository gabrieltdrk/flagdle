type PolicySectionProps = {
  title: string;
  text: string;
};

export function PolicySection({ title, text }: PolicySectionProps) {
  return (
    <article className="rounded-[1.6rem] border border-sky-200 bg-white/72 p-5">
      <h2 className="text-lg font-black text-slate-800">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{text}</p>
    </article>
  );
}
