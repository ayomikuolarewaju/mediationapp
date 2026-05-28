export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { Scale, CheckCircle, Users, Clock, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-green-900" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">Lagos CMB</p>
              <p className="text-green-300 text-xs">Citizens Mediation Bureau</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="text-green-200 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-800 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="bg-yellow-400 text-green-900 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-green-900 text-white pb-20 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-800 px-4 py-2 rounded-full text-green-200 text-sm mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Free for all Lagos State residents
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Resolve Disputes Without<br />
            <span className="text-yellow-400">Going to Court</span>
          </h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto mb-10">
            The Lagos Citizens Mediation Bureau provides free, confidential mediation services for family disputes, landlord issues, employment conflicts, and more — available in all 20 LGAs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="bg-yellow-400 text-green-900 font-semibold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors flex items-center gap-2">
              File a Complaint <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="border border-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-800 transition-colors">
              Track My Case
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-yellow-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '20', label: 'LGA Offices' },
            { value: 'Free', label: 'For All Residents' },
            { value: '37', label: 'Sub-offices' },
            { value: '100%', label: 'Confidential' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-green-900">{stat.value}</p>
              <p className="text-green-800 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">How It Works</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">Three simple steps to resolve your dispute</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'File a Complaint', desc: 'Register and submit your complaint online with all relevant details about the dispute.', icon: '📝' },
              { step: '2', title: 'Book Mediation', desc: 'Schedule a mediation session at your nearest CMB office or preferred LGA location.', icon: '📅' },
              { step: '3', title: 'Reach Resolution', desc: 'Work with a trained mediator to reach a fair, amicable resolution — or request enforcement.', icon: '✅' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case types */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Types of Disputes We Handle</h2>
          <p className="text-gray-500 text-center mb-12">Comprehensive coverage for everyday civil disputes</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Family Disputes', desc: 'Marital disagreements, child custody, and maintenance issues', emoji: '👨‍👩‍👧' },
              { title: 'Landlord & Tenant', desc: 'Eviction, rent arrears, and property disagreements', emoji: '🏠' },
              { title: 'Employment', desc: 'Unfair dismissal, unpaid salaries, and compensation', emoji: '💼' },
              { title: 'Property & Inheritance', desc: 'Land disputes and property inheritance conflicts', emoji: '📋' },
              { title: 'Financial Claims', desc: 'Unpaid debts and breach of contract', emoji: '💰' },
              { title: 'Other Civil Matters', desc: 'Neighborhood disputes and community conflicts', emoji: '🤝' },
            ].map(type => (
              <div key={type.title} className="flex gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-green-200 hover:shadow-sm transition-all">
                <span className="text-3xl">{type.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                  <p className="text-gray-500 text-sm">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-green-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact the Bureau</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <MapPin className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Headquarters</h3>
              <p className="text-green-300 text-sm">18, King George V Road, Onikan, Lagos</p>
            </div>
            <div>
              <Phone className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Phone Lines</h3>
              <p className="text-green-300 text-sm">08125690717 · 08165892434</p>
              <p className="text-green-300 text-sm">07083504679 · 08118161620</p>
            </div>
            <div>
              <Mail className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-green-300 text-sm">citizen_mediation@lagosstate.gov.ng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} Lagos State Citizens Mediation Bureau. A Lagos State Ministry of Justice Initiative.</p>
      </footer>
    </div>
  )
}
