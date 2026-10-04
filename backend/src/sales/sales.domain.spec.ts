import { labelFor, toSalesPoints } from "./sales.domain";

// fixed instants, written in Manila time (+08:00) so the tests
// pass whatever timezone the machine running them is in
const manila = (iso: string) => new Date(`${iso}+08:00`);

describe("sales.domain", () => {
  it("labels hours in Manila time", () => {
    expect(labelFor.Today(manila("2026-10-04T00:00:00"))).toBe("12 AM");
    expect(labelFor.Today(manila("2026-10-04T15:00:00"))).toBe("3 PM");
  });

  it("labels days by short weekday", () => {
    expect(labelFor.Week(manila("2026-10-04T00:00:00"))).toBe("Sun");
  });

  it("numbers month weeks from the day of the month", () => {
    expect(labelFor.Month(manila("2026-10-01T00:00:00"))).toBe("Wk 1");
    expect(labelFor.Month(manila("2026-10-08T00:00:00"))).toBe("Wk 2");
    expect(labelFor.Month(manila("2026-10-29T00:00:00"))).toBe("Wk 5");
  });

  it("labels months by short name", () => {
    // midnight Jan 1 in Manila is still Dec 31 in UTC
    expect(labelFor.Year(manila("2026-01-01T00:00:00"))).toBe("Jan");
  });

  it("turns rows into chart points with the period's labels", () => {
    const rows = [
      { bucket: manila("2026-10-01T00:00:00"), total: "150.50" },
      { bucket: manila("2026-10-08T00:00:00"), total: 0 },
    ];
    expect(toSalesPoints("Month")(rows)).toEqual([
      { label: "Wk 1", value: 150.5 },
      { label: "Wk 2", value: 0 },
    ]);
  });
});
