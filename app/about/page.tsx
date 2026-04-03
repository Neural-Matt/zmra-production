export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About ZMRA System</h1>

        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The ZMRA (Zenith Medicine Recommendation Assistant) System is a comprehensive medicine inventory and recommendation platform designed for healthcare professionals, pharmacists, and medical institutions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our system provides detailed information about medicines, their classifications, manufacturers, batch tracking, and helps in making informed pharmaceutical decisions.
            </p>
          </section>

          {/* Features */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <span className="text-2xl mr-2">📊</span> Inventory Management
                </h3>
                <p className="text-gray-700">Track medicine batches, manufacturing dates, expiry dates, and available quantities.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <span className="text-2xl mr-2">🔍</span> Advanced Search
                </h3>
                <p className="text-gray-700">Search by brand name, generic name, category, or manufacturer with instant results.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <span className="text-2xl mr-2">💊</span> Comprehensive Database
                </h3>
                <p className="text-gray-700">Access detailed information for 100+ medicines with complete specifications.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <span className="text-2xl mr-2">🏥</span> Classification System
                </h3>
                <p className="text-gray-700">Medicines organized by therapeutic category, drug class, and dosage form.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <span className="text-2xl mr-2">📸</span> Visual Information
                </h3>
                <p className="text-gray-700">Product, pill, and packaging images for easy medicine identification.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <span className="text-2xl mr-2">🌍</span> Global Coverage
                </h3>
                <p className="text-gray-700">Medicines from manufacturers worldwide with approval status tracking.</p>
              </div>
            </div>
          </section>

          {/* Data Categories */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Information Tracked</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Medicine Details</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Brand Name</li>
                  <li>• Generic Name</li>
                  <li>• Dosage Form</li>
                  <li>• Strength</li>
                  <li>• Route of Administration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">Classification</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Therapeutic Category</li>
                  <li>• Drug Class</li>
                  <li>• Approval Status</li>
                  <li>• Manufacturer Info</li>
                  <li>• Country of Origin</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">Batch Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Batch Number</li>
                  <li>• Manufacturing Date</li>
                  <li>• Expiry Date</li>
                  <li>• Quantity Available</li>
                  <li>• Storage Conditions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">Visual Resources</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Product Image</li>
                  <li>• Pill/Tablet Image</li>
                  <li>• Packaging Image</li>
                  <li>• Specifications</li>
                  <li>• Usage Guidelines</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Frontend</h3>
                <p className="text-gray-700">Next.js 16, React, TypeScript, Tailwind CSS</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Backend</h3>
                <p className="text-gray-700">Node.js, REST API</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Data</h3>
                <p className="text-gray-700">JSON database with comprehensive medicine records</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Deployment</h3>
                <p className="text-gray-700">Vercel, Railway, Heroku, Self-hosted VPS</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 rounded-lg border border-blue-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              Have questions or need support? Contact us for more information about the ZMRA System.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
              Contact Support
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
