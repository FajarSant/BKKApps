// app/not-found.tsx
import BackButton from "@/components/Back-Button";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Gambar animasi latar */}
        <div
          className="mx-auto bg-center bg-no-repeat bg-contain h-64 sm:h-80 md:h-96"
          style={{
            backgroundImage:
              "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
          }}
          role="img"
          aria-label="Animasi 404"
        />

        {/* Teks utama */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-800 mt-6">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-4">
          Sepertinya kamu tersesat
        </h2>
        <p className="text-gray-500 mt-2">
          Halaman yang kamu cari tidak tersedia!
        </p>

         <BackButton />
      </div>
    </section>
  );
}
