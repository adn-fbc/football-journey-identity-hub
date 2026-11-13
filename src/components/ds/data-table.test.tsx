import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type Column } from "@/components/ds/data-table";

interface PlayerRow {
  id: string;
  name: string;
}

describe("DataTable row navigation", () => {
  it("supports Enter and Space on an accessible desktop row", () => {
    const onRowClick = vi.fn();
    const columns: Column<PlayerRow>[] = [
      { key: "name", header: "Player", cell: (player) => player.name },
    ];

    render(
      <DataTable
        rows={[{ id: "p-1", name: "Rizky Pratama" }]}
        columns={columns}
        getRowId={(player) => player.id}
        getRowLabel={(player) => player.name}
        onRowClick={onRowClick}
      />,
    );

    const row = screen.getByRole("row", { name: "Open Rizky Pratama" });
    expect(row).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(row, { key: "Enter" });
    fireEvent.keyDown(row, { key: " " });

    expect(onRowClick).toHaveBeenCalledTimes(2);
  });
});
