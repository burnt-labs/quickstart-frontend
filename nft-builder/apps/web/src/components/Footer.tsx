export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-600">
            Built with ❤️ for the XION ecosystem
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a
              href="https://docs.burnt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Documentation
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}