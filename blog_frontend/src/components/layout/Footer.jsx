function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            BlogSphere
          </h2>

          <p className="mt-4 text-sm leading-6">
            Discover programming, web development,
            technology and modern software engineering
            articles written by passionate developers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li>
              <a
                href="/"
                className="hover:text-white"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="/login"
                className="hover:text-white"
              >
                Login
              </a>
            </li>

            <li>
              <a
                href="/register"
                className="hover:text-white"
              >
                Register
              </a>
            </li>

            <li>
              <a
                href="/dashboard"
                className="hover:text-white"
              >
                Dashboard
              </a>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Categories
          </h3>

          <ul className="space-y-2">
            <li>Programming</li>
            <li>Python</li>
            <li>React</li>
            <li>Django</li>
            <li>JavaScript</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact
          </h3>

          <p>Email</p>
          <p>support@blogsphere.com</p>

          <div className="flex gap-3 mt-5">
            <button className="bg-gray-800 hover:bg-blue-600 transition px-3 py-2 rounded">
              Facebook
            </button>

            <button className="bg-gray-800 hover:bg-sky-500 transition px-3 py-2 rounded">
              Twitter
            </button>

            <button className="bg-gray-800 hover:bg-pink-600 transition px-3 py-2 rounded">
              Instagram
            </button>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm">
            © 2026 BlogSphere. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <a
              href="/"
              className="hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="/"
              className="hover:text-white"
            >
              Terms of Service
            </a>

            <a
              href="/"
              className="hover:text-white"
            >
              Cookies
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;