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
    <aside>
      {filters.map((item) => (
        <div key={item.title}>
          <h2>{item.title}</h2>

          {item.sub.map((sub) => (
            <label key={sub}>
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
      ))}
    </aside>
  );
}
