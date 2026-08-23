export interface FilterProps {
  title: string;
  sub: string[];
}

interface FilterBarProps {
  filters: FilterProps[];
  onFilterChange: (title: string, sub: string, checked: boolean) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const formatLabel = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return (
    <aside className="ml-auto w-64 space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {filters.map((item) => (
        <div key={item.title}>
          <h2 className="mb-2 text-sm font-semibold text-slate-800">
            {item.title}
          </h2>

          <div className="space-y-1.5">
            {item.sub.map((sub) => (
              <label
                key={sub}
                className="flex items-center justify-between text-sm text-slate-600"
              >
                {formatLabel(sub)}

                <input
                  type="checkbox"
                  value={sub}
                  onChange={(e) =>
                    onFilterChange(item.title, sub, e.target.checked)
                  }
                />
              </label>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
