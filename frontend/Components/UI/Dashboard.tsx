'use client'

interface DashboardProps {
  userRole: 'superuser' | 'clinic'
}

export default function Dashboard({ userRole }: DashboardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-5xl font-bold text-[#2D1B4E]">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-[#E0D5C7] p-6">
          <p className="text-[#6B5B7F] text-sm">Today&apos;s Sales</p>
          <p className="text-4xl font-bold text-[#2D1B4E] mt-2">6.7M</p>
          <p className="text-xs text-[#6B5B7F] mt-1">01/10/38</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E0D5C7] p-6">
          <p className="text-[#6B5B7F] text-sm">Current Stocks</p>
          <p className="text-4xl font-bold text-[#2D1B4E] mt-2">—</p>
        </div>

        <div className="bg-white rounded-lg border border-[#E0D5C7] p-6">
          <p className="text-[#6B5B7F] text-sm">Incoming Stocks</p>
          <div className="mt-2">
            <p className="text-2xl font-bold text-[#2D1B4E]">9</p>
            <p className="text-2xl font-bold text-[#2D1B4E]">4</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#E0D5C7] p-6">
        <p className="text-[#6B5B7F]">Sample Text</p>
      </div>
    </div>
  )
}
