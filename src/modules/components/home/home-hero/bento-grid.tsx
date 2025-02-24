export default function BentoGrid() {
  return (
    <section className="grid w-full h-48 lg:h-96 grid-cols-3 grid-rows-3 gap-3">
      <div className="relative col-span-1 row-span-1 rounded-xl bg-gradient-to-r from-green-500 to-green-700" />
      <div className="relative col-span-1 row-span-1 rounded-xl bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500" />
      <div className="relative col-span-1 row-span-1 rounded-xl bg-gradient-to-r from-amber-300 to-emerald-400" />

      <div className="relative col-span-2 row-span-1 rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" />
      <div className="relative col-span-1 row-span-1 rounded-xl bg-gradient-to-r from-blue-400 to-emerald-400" />

      <div className="relative col-span-1 row-span-1 rounded-xl bg-gradient-to-r from-rose-300 to-rose-500" />
      <div className="relative col-span-2 row-span-1 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />

    </section>
  )
}