import { Plus, Ticket } from 'lucide-react';

export default function ButtonTicket() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-50 via-brand-rose-50 to-brand-blue-100 flex items-center justify-center p-4">
      <button
        className="group relative bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-102 active:scale-98"
        onClick={() => alert('Creating new ticket...')}
      >
        {/* Main ticket container */}
        <div className="relative flex items-center gap-4 px-8 py-6 border border-brand-rose-200 rounded-lg">
          {/* Perforated edge left */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[1px]"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, #ffc9ea 33%, transparent 0%)',
              backgroundPosition: 'right',
              backgroundSize: '1px 12px',
              backgroundRepeat: 'repeat-y',
            }}
          />

          {/* Ticket content */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-rose-500 to-brand-blue-500 flex items-center justify-center text-white shadow-lg">
              <Ticket className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-brand-rose-600 uppercase tracking-wider font-medium">
                New Ticket
              </span>
              <span className="text-lg font-semibold text-brand-blue-950">
                Create Ticket
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-12 w-[1px] bg-brand-rose-200 mx-2"></div>

          {/* Action button */}
          <div className="h-10 w-10 rounded-full bg-brand-blue-50 flex items-center justify-center text-brand-blue-600 transition-all duration-300 group-hover:rotate-180 group-hover:bg-brand-rose-100 group-hover:text-brand-rose-600">
            <Plus className="w-5 h-5" />
          </div>

          {/* Perforated edge right */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[1px]"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, #ffc9ea 33%, transparent 0%)',
              backgroundPosition: 'right',
              backgroundSize: '1px 12px',
              backgroundRepeat: 'repeat-y',
            }}
          />
        </div>

        {/* Ticket stub effect */}
        <div className="absolute -bottom-1 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-brand-rose-200 to-transparent"></div>
      </button>
    </div>
  );
}
