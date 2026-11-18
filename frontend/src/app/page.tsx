
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-16 border-b">
        <a href="/" className="text-2xl font-bold text-red-600">
          ❤️ BloodHelp
        </a>

        <div className="flex flex-wrap items-center gap-5 font-medium">
          <a href="/" className="hover:text-red-600">Home</a>
          <a href="#services" className="hover:text-red-600">Services</a>
          <a href="/register" className="hover:text-red-600">Become Donor</a>
          <a href="/search" className="hover:text-red-600">Find Blood</a>
          <a href="/blood-request" className="hover:text-red-600">Request Blood</a>
        </div>

        <div className="flex gap-3">
          <a href="/login" className="px-4 py-2 rounded-lg border border-red-600 text-red-600">
            Login
          </a>
          <a href="/signup" className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
            Create Account
          </a>
        </div>
      </nav>

      {/* Hero section */}
      <section id="home" className="bg-red-50 px-6 py-20 md:px-16 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-red-600 font-semibold mb-4">
              EVERY DROP COUNTS ❤️
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Donate Blood,
              <span className="text-red-600"> Save Lives.</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-8">
              BloodHelp connects blood donors with people in need.
              Find donors, register as a donor, and help save lives
              through a simple and accessible platform.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a href="/search" className="bg-red-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-red-700">
                Find a Blood Donor
              </a>

              <a href="/register" className="border border-red-600 text-red-600 px-7 py-3 rounded-lg font-semibold hover:bg-red-100">
                Become a Donor
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
            <div className="text-8xl mb-5">🩸</div>
            <h2 className="text-2xl font-bold text-red-600">
              Be Someone's Hero
            </h2>
            <p className="text-gray-600 mt-3">
              Your small act of kindness can give someone another chance
              at life.
            </p>
            <p className="mt-6 text-red-600 font-semibold">
              Donate Blood. Spread Hope.
            </p>
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="px-6 py-20 md:px-16 text-center">
        <p className="text-red-600 font-semibold">ABOUT BLOODHELP</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-3">
          Connecting Donors With Those in Need
        </h2>
        <p className="max-w-3xl mx-auto mt-6 text-gray-600 leading-8">
          BloodHelp is a blood assistance platform designed to make
          finding blood donors easier. It helps people search for donors,
          register as volunteers, and share blood requirements.
        </p>
      </section>

      {/* Services section */}
      <section id="services" className="bg-gray-50 px-6 py-20 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-600 font-semibold">WHAT WE OFFER</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Our Services
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
              <div className="text-5xl mb-5">🩸</div>
              <h3 className="text-xl font-bold">Become a Donor</h3>
              <p className="text-gray-600 mt-3 leading-7">
                Register yourself and help someone in need.
              </p>
              <a href="/register" className="inline-block mt-6 bg-red-600 text-white px-5 py-2 rounded-lg">
                Register Now
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
              <div className="text-5xl mb-5">🔍</div>
              <h3 className="text-xl font-bold">Find Blood</h3>
              <p className="text-gray-600 mt-3 leading-7">
                Search for donors using their blood group and city.
              </p>
              <a href="/search" className="inline-block mt-6 bg-red-600 text-white px-5 py-2 rounded-lg">
                Search Donors
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
              <div className="text-5xl mb-5">🚨</div>
              <h3 className="text-xl font-bold">Request Blood</h3>
              <p className="text-gray-600 mt-3 leading-7">
                Submit a blood request for a patient.
              </p>
              <a href="/blood-request" className="inline-block mt-6 bg-red-600 text-white px-5 py-2 rounded-lg">
                Request Now
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
              <div className="text-5xl mb-5">👥</div>
              <h3 className="text-xl font-bold">Registered Donors</h3>
              <p className="text-gray-600 mt-3 leading-7">
                View the registered donor list.
              </p>
              <a href="/donors" className="inline-block mt-6 bg-red-600 text-white px-5 py-2 rounded-lg">
                View Donors
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition">
              <div className="text-5xl mb-5">📋</div>
              <h3 className="text-xl font-bold">Blood Requests</h3>
              <p className="text-gray-600 mt-3 leading-7">
                View submitted blood requests.
              </p>
              <a href="/requests" className="inline-block mt-6 bg-red-600 text-white px-5 py-2 rounded-lg">
                View Requests
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Account Access */}
      <section className="px-6 py-16 text-center">
        <p className="text-red-600 font-semibold">YOUR ACCOUNT</p>
        <h2 className="text-3xl font-bold mt-3">Account Access</h2>
        <p className="text-gray-600 mt-4">
          Create an account, log in, or visit your dashboard.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a href="/signup" className="bg-red-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-red-700">
            Create Account
          </a>

          <a href="/login" className="bg-gray-800 text-white px-7 py-3 rounded-lg font-semibold hover:bg-gray-900">
            Login
          </a>

          <a href="/dashboard" className="border border-red-600 text-red-600 px-7 py-3 rounded-lg font-semibold hover:bg-red-50">
            User Dashboard
          </a>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact" className="px-6 py-16 text-center bg-red-50">
        <h2 className="text-3xl font-bold">
          Be the Reason Someone Smiles
        </h2>
        <p className="text-gray-600 mt-4">
          Join BloodHelp and become part of a community that cares.
        </p>
        <a href="/register" className="inline-block mt-7 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700">
          Join BloodHelp
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-8 text-center">
        <h2 className="text-xl font-bold text-red-400">❤️ BloodHelp</h2>
        <p className="text-gray-400 mt-3">
          Every Drop Can Save a Life.
        </p>
        <p className="text-gray-500 text-sm mt-5">
          BloodHelp © 2026 | Every Drop Can Save a Life ❤️
        </p>
      </footer>
    </main>
  );
}
