"use client";

// src/DataTable.tsx
import { useEffect as useEffect6, useId as useId4, useMemo as useMemo2, useRef as useRef5, useState as useState6 } from "react";

// src/utils.ts
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
function toCssSize(value) {
  return typeof value === "number" ? `${value}px` : value;
}
var INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="button"], [role="checkbox"], [role="link"], [data-cdt-no-row-click]';
function isFromInteractive(target, row) {
  if (!(target instanceof Element)) return false;
  const interactive = target.closest(INTERACTIVE);
  return interactive !== null && interactive !== row && row.contains(interactive);
}

// src/components/BulkBar.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function BulkBar({ table, labels, bulkActions, className }) {
  const count = table.selectedKeys.length;
  const canSelectMore = table.selectionMode === "multiple" && !table.serverSide && table.pageSelectionState === "all" && count < table.matchingSelectableCount;
  return /* @__PURE__ */ jsxs("div", { className: cx("cdt-bulkbar", className), children: [
    /* @__PURE__ */ jsx("span", { className: "cdt-bulkbar-count", children: labels.selectedCount(count) }),
    canSelectMore && /* @__PURE__ */ jsx("button", { type: "button", className: "cdt-link", onClick: table.selectAllMatching, children: labels.selectAllMatching(table.matchingSelectableCount) }),
    /* @__PURE__ */ jsx("button", { type: "button", className: "cdt-link", onClick: table.clearSelection, children: labels.clearSelection }),
    bulkActions && /* @__PURE__ */ jsx("div", { className: "cdt-bulkbar-actions", children: bulkActions(table.selectedRows, {
      selectedKeys: table.selectedKeys,
      clearSelection: table.clearSelection
    }) })
  ] });
}

// src/components/shared.tsx
import { useEffect, useRef, useState } from "react";

// src/components/icons.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Icon({ children, ...props }) {
  return /* @__PURE__ */ jsx2(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false",
      className: "cdt-icon",
      ...props,
      children
    }
  );
}
var SearchIcon = () => /* @__PURE__ */ jsxs2(Icon, { children: [
  /* @__PURE__ */ jsx2("circle", { cx: "11", cy: "11", r: "7" }),
  /* @__PURE__ */ jsx2("path", { d: "m20 20-3.5-3.5" })
] });
var CloseIcon = () => /* @__PURE__ */ jsx2(Icon, { children: /* @__PURE__ */ jsx2("path", { d: "M18 6 6 18M6 6l12 12" }) });
var ColumnsIcon = () => /* @__PURE__ */ jsxs2(Icon, { children: [
  /* @__PURE__ */ jsx2("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ jsx2("path", { d: "M9 4v16M15 4v16" })
] });
var ChevronLeftIcon = () => /* @__PURE__ */ jsx2(Icon, { children: /* @__PURE__ */ jsx2("path", { d: "m15 18-6-6 6-6" }) });
var ChevronRightIcon = () => /* @__PURE__ */ jsx2(Icon, { children: /* @__PURE__ */ jsx2("path", { d: "m9 18 6-6-6-6" }) });
var ChevronsLeftIcon = () => /* @__PURE__ */ jsx2(Icon, { children: /* @__PURE__ */ jsx2("path", { d: "m11 17-5-5 5-5M18 17l-5-5 5-5" }) });
var ChevronsRightIcon = () => /* @__PURE__ */ jsx2(Icon, { children: /* @__PURE__ */ jsx2("path", { d: "m13 17 5-5-5-5M6 17l5-5-5-5" }) });
function SortIcon({ direction }) {
  return /* @__PURE__ */ jsxs2(Icon, { className: "cdt-icon cdt-sort-icon", "data-direction": direction != null ? direction : "none", width: "14", height: "14", children: [
    /* @__PURE__ */ jsx2("path", { className: "cdt-sort-up", d: "m7 9 5-5 5 5" }),
    /* @__PURE__ */ jsx2("path", { className: "cdt-sort-down", d: "m7 15 5 5 5-5" })
  ] });
}
var InboxIcon = () => /* @__PURE__ */ jsxs2(Icon, { width: "22", height: "22", children: [
  /* @__PURE__ */ jsx2("path", { d: "M22 12h-6l-2 3h-4l-2-3H2" }),
  /* @__PURE__ */ jsx2("path", { d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" })
] });
var AlertIcon = () => /* @__PURE__ */ jsxs2(Icon, { width: "22", height: "22", children: [
  /* @__PURE__ */ jsx2("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsx2("path", { d: "M12 8v4M12 16h.01" })
] });

// src/components/shared.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function formatValue(value, labels) {
  if (value === null || value === void 0 || value === "") {
    return /* @__PURE__ */ jsx3("span", { className: "cdt-empty-value", children: "\u2014" });
  }
  if (typeof value === "boolean") return value ? labels.yes : labels.no;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? "\u2014" : value.toLocaleDateString();
  if (Array.isArray(value)) return value.map((v) => typeof v === "object" ? JSON.stringify(v) : String(v)).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
function renderCell(column, entry, labels) {
  const value = column.read(entry.row);
  if (column.render) {
    return column.render(value, entry.row, {
      row: entry.row,
      rowKey: entry.key,
      rowIndex: entry.index,
      column
    });
  }
  return formatValue(value, labels);
}
function cellClassName(column, row) {
  return typeof column.className === "function" ? column.className(row) : column.className;
}
function RowActionButtons({ row, actions }) {
  return /* @__PURE__ */ jsx3("div", { className: "cdt-row-actions", children: actions.filter((action) => {
    var _a;
    return !((_a = action.hidden) == null ? void 0 : _a.call(action, row));
  }).map((action) => {
    const disabled = typeof action.disabled === "function" ? action.disabled(row) : Boolean(action.disabled);
    return /* @__PURE__ */ jsxs3(
      "button",
      {
        type: "button",
        className: cx(
          "cdt-btn cdt-btn--sm",
          action.variant && action.variant !== "default" && `cdt-btn--${action.variant}`,
          action.iconOnly && "cdt-btn--icon"
        ),
        disabled,
        "aria-label": action.iconOnly ? action.label : void 0,
        title: action.iconOnly ? action.label : void 0,
        onClick: () => action.onClick(row),
        children: [
          action.icon,
          !action.iconOnly && /* @__PURE__ */ jsx3("span", { children: action.label })
        ]
      },
      action.label
    );
  }) });
}
function renderRowActions(row, rowActions) {
  if (!rowActions) return null;
  if (typeof rowActions === "function") return /* @__PURE__ */ jsx3("div", { className: "cdt-row-actions", children: rowActions(row) });
  return /* @__PURE__ */ jsx3(RowActionButtons, { row, actions: rowActions });
}
function SelectCheckbox({
  checked,
  indeterminate = false,
  disabled,
  label,
  onChange
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return /* @__PURE__ */ jsx3(
    "input",
    {
      ref,
      type: "checkbox",
      className: "cdt-checkbox",
      checked,
      disabled,
      "aria-label": label,
      onChange
    }
  );
}
function ExpandButton({
  expanded,
  controls,
  labels,
  onToggle
}) {
  return /* @__PURE__ */ jsx3(
    "button",
    {
      type: "button",
      className: "cdt-btn cdt-btn--ghost cdt-btn--icon cdt-btn--sm cdt-expand-btn",
      "aria-expanded": expanded,
      "aria-controls": expanded ? controls : void 0,
      "aria-label": expanded ? labels.collapseRow : labels.expandRow,
      title: expanded ? labels.collapseRow : labels.expandRow,
      onClick: onToggle,
      children: /* @__PURE__ */ jsx3(ChevronRightIcon, {})
    }
  );
}
function expandedId(prefix, key) {
  return `${prefix}-expanded-${String(key).replace(/[^\w-]/g, "_")}`;
}
function useRowInteraction(view) {
  var _a;
  const { table, onRowClick } = view;
  const [activeKey, setActiveKey] = useState(null);
  const navigable = Boolean(onRowClick || table.selectionMode || table.expandable);
  const rowKeys = table.rows.map((r) => r.key);
  const focusKey = activeKey !== null && rowKeys.includes(activeKey) ? activeKey : (_a = rowKeys[0]) != null ? _a : null;
  const moveFocus = (current, direction) => {
    const container = current.closest("[data-cdt-rows]");
    if (!container) return;
    const items = Array.from(container.querySelectorAll("[data-cdt-row]"));
    const index = items.indexOf(current);
    const target = direction === "first" ? items[0] : direction === "last" ? items[items.length - 1] : items[index + (direction === "next" ? 1 : -1)];
    target == null ? void 0 : target.focus();
  };
  const getRowProps = (entry) => {
    const { row, key } = entry;
    const clickable = Boolean(onRowClick);
    return {
      "data-cdt-row": "",
      "data-selected": table.isSelected(key) || void 0,
      "data-clickable": clickable || void 0,
      tabIndex: navigable ? key === focusKey ? 0 : -1 : void 0,
      onFocus: navigable ? () => setActiveKey(key) : void 0,
      onClick: clickable ? (event) => {
        if (isFromInteractive(event.target, event.currentTarget)) return;
        onRowClick(row, event);
      } : void 0,
      onKeyDown: navigable ? (event) => {
        if (event.target !== event.currentTarget) return;
        const el = event.currentTarget;
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            return moveFocus(el, "next");
          case "ArrowUp":
            event.preventDefault();
            return moveFocus(el, "prev");
          case "Home":
            event.preventDefault();
            return moveFocus(el, "first");
          case "End":
            event.preventDefault();
            return moveFocus(el, "last");
          case "ArrowRight":
            if (table.canExpandRow(row) && !table.isExpanded(key)) table.toggleExpanded(key);
            return;
          case "ArrowLeft":
            if (table.isExpanded(key)) table.toggleExpanded(key);
            return;
          case "Enter":
            if (onRowClick) onRowClick(row, event);
            else if (table.canExpandRow(row)) table.toggleExpanded(key);
            return;
          case " ":
            if (table.canSelectRow(row)) {
              event.preventDefault();
              table.toggleRowSelection(key);
            }
            return;
        }
      } : void 0
    };
  };
  return { getRowProps };
}

// src/components/CardView.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function CardView(props) {
  var _a;
  const {
    table,
    columns,
    labels,
    classNames,
    body,
    loading,
    idPrefix,
    rowActions,
    renderExpanded,
    rowClassName,
    skeletonRows,
    labelledBy,
    ariaLabel
  } = props;
  const { getRowProps } = useRowInteraction(props);
  const primary = (_a = columns.find((c) => c.primary)) != null ? _a : columns[0];
  const rest = columns.filter((c) => c !== primary);
  const selectable = table.selectionMode !== null;
  if (body.kind === "message") return /* @__PURE__ */ jsx4("div", { className: "cdt-cards-state", children: body.content });
  return /* @__PURE__ */ jsxs4("div", { className: "cdt-cards-wrap", "aria-busy": loading || void 0, children: [
    selectable && table.selectionMode === "multiple" && body.kind === "rows" && /* @__PURE__ */ jsxs4("label", { className: "cdt-cards-select-all", children: [
      /* @__PURE__ */ jsx4(
        SelectCheckbox,
        {
          checked: table.pageSelectionState === "all",
          indeterminate: table.pageSelectionState === "some",
          label: labels.selectAllOnPage,
          onChange: table.togglePageSelection
        }
      ),
      /* @__PURE__ */ jsx4("span", { "aria-hidden": "true", children: labels.selectAllOnPage })
    ] }),
    /* @__PURE__ */ jsxs4(
      "ul",
      {
        className: "cdt-cards",
        "aria-labelledby": labelledBy,
        "aria-label": labelledBy ? void 0 : ariaLabel,
        "data-cdt-rows": "",
        "data-loading": loading || void 0,
        children: [
          body.kind === "skeleton" && Array.from({ length: skeletonRows }, (_, i) => /* @__PURE__ */ jsxs4("li", { className: "cdt-card", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx4("span", { className: "cdt-skeleton", style: { width: "55%", height: 14 } }),
            /* @__PURE__ */ jsx4("span", { className: "cdt-skeleton", style: { width: "80%" } }),
            /* @__PURE__ */ jsx4("span", { className: "cdt-skeleton", style: { width: "65%" } })
          ] }, i)),
          body.kind === "rows" && table.rows.map((entry, i) => {
            const { row, key } = entry;
            const isExpanded = Boolean(renderExpanded) && table.isExpanded(key);
            const detailsId = expandedId(idPrefix, key);
            return /* @__PURE__ */ jsxs4(
              "li",
              {
                className: cx(
                  "cdt-card",
                  classNames.card,
                  typeof rowClassName === "function" ? rowClassName(row, i) : rowClassName
                ),
                ...getRowProps(entry),
                children: [
                  /* @__PURE__ */ jsxs4("div", { className: "cdt-card-head", children: [
                    selectable && /* @__PURE__ */ jsx4(
                      SelectCheckbox,
                      {
                        checked: table.isSelected(key),
                        disabled: !table.canSelectRow(row),
                        label: labels.selectRow,
                        onChange: () => table.toggleRowSelection(key)
                      }
                    ),
                    primary && /* @__PURE__ */ jsx4("div", { className: cx("cdt-card-title", cellClassName(primary, row)), children: renderCell(primary, entry, labels) }),
                    renderExpanded && table.canExpandRow(row) && /* @__PURE__ */ jsx4(
                      ExpandButton,
                      {
                        expanded: isExpanded,
                        controls: detailsId,
                        labels,
                        onToggle: () => table.toggleExpanded(key)
                      }
                    )
                  ] }),
                  rest.length > 0 && /* @__PURE__ */ jsx4("dl", { className: "cdt-card-fields", children: rest.map((column) => /* @__PURE__ */ jsxs4("div", { className: "cdt-card-field", children: [
                    /* @__PURE__ */ jsx4("dt", { children: column.label }),
                    /* @__PURE__ */ jsx4("dd", { className: cellClassName(column, row), children: renderCell(column, entry, labels) })
                  ] }, column.key)) }),
                  rowActions && /* @__PURE__ */ jsx4("div", { className: "cdt-card-actions", children: renderRowActions(row, rowActions) }),
                  isExpanded && renderExpanded && /* @__PURE__ */ jsx4("div", { className: "cdt-card-expanded", id: detailsId, children: renderExpanded(row) })
                ]
              },
              key
            );
          })
        ]
      }
    )
  ] });
}

// src/components/Pagination.tsx
import { useId } from "react";

// src/core/paginate.ts
function getPageCount(totalRows, pageSize) {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(totalRows / pageSize));
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function getPageItems(page, pageCount, siblings = 1) {
  const slots = siblings * 2 + 5;
  if (pageCount <= slots) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showStart = left > 3;
  const showEnd = right < pageCount - 2;
  const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (!showStart) return [...range(1, 3 + siblings * 2), "ellipsis-end", pageCount];
  if (!showEnd) return [1, "ellipsis-start", ...range(pageCount - (2 + siblings * 2), pageCount)];
  return [1, "ellipsis-start", ...range(left, right), "ellipsis-end", pageCount];
}

// src/labels.ts
var defaultLabels = {
  searchPlaceholder: "Search\u2026",
  searchLabel: "Search table",
  clearSearch: "Clear search",
  columns: "Columns",
  toggleColumns: "Show or hide columns",
  loading: "Loading\u2026",
  empty: "No data to display",
  noResults: (search) => `No results for \u201C${search}\u201D`,
  error: "Something went wrong while loading data.",
  retry: "Try again",
  rowsPerPage: "Rows per page",
  rangeInfo: (from, to, total) => `${from}\u2013${to} of ${total}`,
  pageInfo: (page, pageCount) => `Page ${page} of ${pageCount}`,
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  goToPage: (page) => `Go to page ${page}`,
  pagination: "Pagination",
  selectAllOnPage: "Select all rows on this page",
  selectRow: "Select row",
  selectedCount: (count) => `${count} selected`,
  selectAllMatching: (count) => `Select all ${count}`,
  clearSelection: "Clear selection",
  expandRow: "Expand row",
  collapseRow: "Collapse row",
  actions: "Actions",
  sortBy: "Sort by",
  sortPriority: (index) => `sort priority ${index}`,
  sortedAscending: (column) => `Sorted by ${column}, ascending`,
  sortedDescending: (column) => `Sorted by ${column}, descending`,
  sortCleared: "Sorting removed",
  resultsCount: (count) => count === 1 ? "1 result" : `${count} results`,
  yes: "Yes",
  no: "No"
};

// src/components/Pagination.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function Pagination({
  page,
  pageSize,
  pageCount,
  totalRows,
  from,
  to,
  pageSizeOptions,
  canPreviousPage,
  canNextPage,
  setPage,
  setPageSize,
  labels: labelOverrides,
  compact: compact2 = false,
  className
}) {
  const labels = { ...defaultLabels, ...labelOverrides };
  const sizeId = useId();
  const sizes = pageSizeOptions.includes(pageSize) ? pageSizeOptions : [...pageSizeOptions, pageSize].sort((a, b) => a - b);
  return /* @__PURE__ */ jsxs5("div", { className: cx("cdt-pagination", className), children: [
    /* @__PURE__ */ jsxs5("div", { className: "cdt-pagination-info", children: [
      pageSizeOptions.length > 0 && /* @__PURE__ */ jsxs5("div", { className: "cdt-page-size", children: [
        /* @__PURE__ */ jsx5("label", { htmlFor: sizeId, children: labels.rowsPerPage }),
        /* @__PURE__ */ jsx5(
          "select",
          {
            id: sizeId,
            className: "cdt-select",
            value: pageSize,
            onChange: (e) => setPageSize(Number(e.target.value)),
            children: sizes.map((size) => /* @__PURE__ */ jsx5("option", { value: size, children: size }, size))
          }
        )
      ] }),
      /* @__PURE__ */ jsx5("span", { className: "cdt-range", children: labels.rangeInfo(from, to, totalRows) })
    ] }),
    /* @__PURE__ */ jsxs5("nav", { className: "cdt-pages", "aria-label": labels.pagination, children: [
      /* @__PURE__ */ jsx5(
        "button",
        {
          type: "button",
          className: "cdt-page-btn",
          onClick: () => setPage(1),
          disabled: !canPreviousPage,
          "aria-label": labels.firstPage,
          title: labels.firstPage,
          children: /* @__PURE__ */ jsx5(ChevronsLeftIcon, {})
        }
      ),
      /* @__PURE__ */ jsx5(
        "button",
        {
          type: "button",
          className: "cdt-page-btn",
          onClick: () => setPage(page - 1),
          disabled: !canPreviousPage,
          "aria-label": labels.previousPage,
          title: labels.previousPage,
          children: /* @__PURE__ */ jsx5(ChevronLeftIcon, {})
        }
      ),
      compact2 ? /* @__PURE__ */ jsx5("span", { className: "cdt-page-status", children: labels.pageInfo(page, pageCount) }) : getPageItems(page, pageCount).map(
        (item) => typeof item === "number" ? /* @__PURE__ */ jsx5(
          "button",
          {
            type: "button",
            className: "cdt-page-btn",
            "data-active": item === page || void 0,
            "aria-current": item === page ? "page" : void 0,
            "aria-label": labels.goToPage(item),
            onClick: () => setPage(item),
            children: item
          },
          item
        ) : /* @__PURE__ */ jsx5("span", { className: "cdt-page-ellipsis", "aria-hidden": "true", children: "\u2026" }, item)
      ),
      /* @__PURE__ */ jsx5(
        "button",
        {
          type: "button",
          className: "cdt-page-btn",
          onClick: () => setPage(page + 1),
          disabled: !canNextPage,
          "aria-label": labels.nextPage,
          title: labels.nextPage,
          children: /* @__PURE__ */ jsx5(ChevronRightIcon, {})
        }
      ),
      /* @__PURE__ */ jsx5(
        "button",
        {
          type: "button",
          className: "cdt-page-btn",
          onClick: () => setPage(pageCount),
          disabled: !canNextPage,
          "aria-label": labels.lastPage,
          title: labels.lastPage,
          children: /* @__PURE__ */ jsx5(ChevronsRightIcon, {})
        }
      )
    ] })
  ] });
}

// src/components/StateMessage.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function StateMessage({ icon, title, description, action, tone = "neutral", role }) {
  return /* @__PURE__ */ jsxs6("div", { className: "cdt-state", "data-tone": tone, role, children: [
    icon && /* @__PURE__ */ jsx6("div", { className: "cdt-state-icon", children: icon }),
    /* @__PURE__ */ jsx6("div", { className: "cdt-state-title", children: title }),
    description && /* @__PURE__ */ jsx6("div", { className: "cdt-state-description", children: description }),
    action && /* @__PURE__ */ jsx6("div", { className: "cdt-state-action", children: action })
  ] });
}

// src/components/TableView.tsx
import { Fragment } from "react";
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function TableView(props) {
  const {
    table,
    columns,
    labels,
    classNames,
    body,
    loading,
    idPrefix,
    rowActions,
    renderExpanded,
    rowClassName,
    skeletonRows,
    caption,
    labelledBy,
    ariaLabel
  } = props;
  const { getRowProps } = useRowInteraction(props);
  const selectable = table.selectionMode !== null;
  const expandable = Boolean(renderExpanded);
  const hasActions = Boolean(rowActions);
  const colSpan = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (hasActions ? 1 : 0);
  const indexRows = table.paginated && !expandable && body.kind === "rows";
  return /* @__PURE__ */ jsxs7(
    "table",
    {
      className: cx("cdt-table", classNames.table),
      "aria-labelledby": labelledBy,
      "aria-label": labelledBy ? void 0 : ariaLabel,
      "aria-busy": loading || void 0,
      "aria-rowcount": indexRows ? table.totalRows + 1 : void 0,
      children: [
        caption && /* @__PURE__ */ jsx7("caption", { className: "cdt-sr-only", children: caption }),
        /* @__PURE__ */ jsx7("thead", { className: classNames.thead, children: /* @__PURE__ */ jsxs7("tr", { "aria-rowindex": indexRows ? 1 : void 0, children: [
          selectable && /* @__PURE__ */ jsx7("th", { scope: "col", className: cx("cdt-th cdt-col-select", classNames.th), children: table.selectionMode === "multiple" ? /* @__PURE__ */ jsx7(
            SelectCheckbox,
            {
              checked: table.pageSelectionState === "all" && table.rows.length > 0,
              indeterminate: table.pageSelectionState === "some",
              disabled: table.rows.length === 0,
              label: labels.selectAllOnPage,
              onChange: table.togglePageSelection
            }
          ) : /* @__PURE__ */ jsx7("span", { className: "cdt-sr-only", children: labels.selectRow }) }),
          expandable && /* @__PURE__ */ jsx7("th", { scope: "col", className: cx("cdt-th cdt-col-expand", classNames.th), children: /* @__PURE__ */ jsx7("span", { className: "cdt-sr-only", children: labels.expandRow }) }),
          columns.map((column) => /* @__PURE__ */ jsx7(HeaderCell, { column, ...props }, column.key)),
          hasActions && /* @__PURE__ */ jsx7("th", { scope: "col", className: cx("cdt-th cdt-col-actions", classNames.th), "data-align": "right", children: labels.actions })
        ] }) }),
        /* @__PURE__ */ jsxs7("tbody", { className: classNames.tbody, "data-cdt-rows": "", "data-loading": loading || void 0, children: [
          body.kind === "skeleton" && Array.from({ length: skeletonRows }, (_, i) => /* @__PURE__ */ jsx7("tr", { className: "cdt-skeleton-row", "aria-hidden": "true", children: Array.from({ length: colSpan }, (_2, j) => /* @__PURE__ */ jsx7("td", { className: "cdt-td", children: /* @__PURE__ */ jsx7("span", { className: "cdt-skeleton", style: { width: `${45 + (i * 7 + j * 13) % 45}%` } }) }, j)) }, `skeleton-${i}`)),
          body.kind === "message" && /* @__PURE__ */ jsx7("tr", { children: /* @__PURE__ */ jsx7("td", { colSpan, className: "cdt-td cdt-state-cell", children: body.content }) }),
          body.kind === "rows" && table.rows.map((entry, i) => {
            const { row, key } = entry;
            const isExpanded = expandable && table.isExpanded(key);
            const canExpand = expandable && table.canExpandRow(row);
            const detailsId = expandedId(idPrefix, key);
            return /* @__PURE__ */ jsxs7(Fragment, { children: [
              /* @__PURE__ */ jsxs7(
                "tr",
                {
                  className: cx(
                    "cdt-row",
                    classNames.tr,
                    typeof rowClassName === "function" ? rowClassName(row, i) : rowClassName
                  ),
                  "data-stripe": i % 2 === 1 || void 0,
                  "data-expanded": isExpanded || void 0,
                  "aria-rowindex": indexRows ? table.from + i + 1 : void 0,
                  ...getRowProps(entry),
                  children: [
                    selectable && /* @__PURE__ */ jsx7("td", { className: cx("cdt-td cdt-col-select", classNames.td), children: /* @__PURE__ */ jsx7(
                      SelectCheckbox,
                      {
                        checked: table.isSelected(key),
                        disabled: !table.canSelectRow(row),
                        label: labels.selectRow,
                        onChange: () => table.toggleRowSelection(key)
                      }
                    ) }),
                    expandable && /* @__PURE__ */ jsx7("td", { className: cx("cdt-td cdt-col-expand", classNames.td), children: canExpand && /* @__PURE__ */ jsx7(
                      ExpandButton,
                      {
                        expanded: isExpanded,
                        controls: detailsId,
                        labels,
                        onToggle: () => table.toggleExpanded(key)
                      }
                    ) }),
                    columns.map((column) => /* @__PURE__ */ jsx7(
                      "td",
                      {
                        className: cx("cdt-td", classNames.td, cellClassName(column, row)),
                        "data-align": column.align,
                        children: renderCell(column, entry, labels)
                      },
                      column.key
                    )),
                    hasActions && /* @__PURE__ */ jsx7("td", { className: cx("cdt-td cdt-col-actions", classNames.td), "data-align": "right", children: renderRowActions(row, rowActions) })
                  ]
                }
              ),
              isExpanded && renderExpanded && /* @__PURE__ */ jsx7("tr", { className: "cdt-expanded-row", id: detailsId, children: /* @__PURE__ */ jsx7("td", { colSpan, className: "cdt-td cdt-expanded-cell", children: renderExpanded(row) }) })
            ] }, key);
          })
        ] })
      ]
    }
  );
}
function HeaderCell({ column, table, labels, classNames }) {
  var _a;
  const sortState = table.getSortState(column.key);
  const direction = sortState == null ? void 0 : sortState.direction;
  const showIndex = sortState && table.sort.length > 1;
  const content = typeof column.header === "function" ? column.header({ column, sortDirection: direction, sortIndex: sortState == null ? void 0 : sortState.index }) : (_a = column.header) != null ? _a : column.label;
  const onKeyDown = (event) => {
    if (event.shiftKey && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      table.toggleSort(column.key, true);
    }
  };
  return /* @__PURE__ */ jsx7(
    "th",
    {
      scope: "col",
      className: cx("cdt-th", classNames.th, column.headerClassName),
      "data-align": column.align,
      "data-sorted": direction,
      "aria-sort": direction === "asc" ? "ascending" : direction === "desc" ? "descending" : void 0,
      style: { width: toCssSize(column.width), minWidth: toCssSize(column.minWidth) },
      children: column.canSort ? /* @__PURE__ */ jsxs7(
        "button",
        {
          type: "button",
          className: "cdt-sort-btn",
          onClick: (event) => table.toggleSort(column.key, event.shiftKey || event.metaKey || event.ctrlKey),
          onKeyDown,
          children: [
            /* @__PURE__ */ jsx7("span", { children: content }),
            /* @__PURE__ */ jsx7(SortIcon, { direction }),
            showIndex && /* @__PURE__ */ jsxs7("span", { className: "cdt-sort-index", children: [
              /* @__PURE__ */ jsx7("span", { "aria-hidden": "true", children: sortState.index }),
              /* @__PURE__ */ jsxs7("span", { className: "cdt-sr-only", children: [
                ", ",
                labels.sortPriority(sortState.index)
              ] })
            ] })
          ]
        }
      ) : content
    }
  );
}

// src/components/Toolbar.tsx
import { useId as useId3 } from "react";

// src/components/ColumnMenu.tsx
import { useEffect as useEffect2, useId as useId2, useRef as useRef2, useState as useState2 } from "react";
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
function ColumnMenu({ columns, hiddenColumns, onToggle, label, title }) {
  const [open, setOpen] = useState2(false);
  const panelId = useId2();
  const rootRef = useRef2(null);
  const buttonRef = useRef2(null);
  const panelRef = useRef2(null);
  const visibleCount = columns.filter((c) => !hiddenColumns.includes(c.key)).length;
  useEffect2(() => {
    var _a, _b;
    if (!open) return;
    (_b = (_a = panelRef.current) == null ? void 0 : _a.querySelector("input:not(:disabled)")) == null ? void 0 : _b.focus();
    const onPointerDown = (event) => {
      var _a2;
      if (!((_a2 = rootRef.current) == null ? void 0 : _a2.contains(event.target))) setOpen(false);
    };
    const onKeyDown = (event) => {
      var _a2;
      if (event.key === "Escape") {
        setOpen(false);
        (_a2 = buttonRef.current) == null ? void 0 : _a2.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
  return /* @__PURE__ */ jsxs8(
    "div",
    {
      className: "cdt-menu",
      ref: rootRef,
      onBlur: (event) => {
        var _a;
        if (open && !((_a = rootRef.current) == null ? void 0 : _a.contains(event.relatedTarget))) setOpen(false);
      },
      children: [
        /* @__PURE__ */ jsxs8(
          "button",
          {
            ref: buttonRef,
            type: "button",
            className: "cdt-btn",
            "aria-expanded": open,
            "aria-controls": open ? panelId : void 0,
            title,
            onClick: () => setOpen((o) => !o),
            children: [
              /* @__PURE__ */ jsx8(ColumnsIcon, {}),
              /* @__PURE__ */ jsx8("span", { className: "cdt-btn-text", children: label })
            ]
          }
        ),
        open && /* @__PURE__ */ jsx8("div", { ref: panelRef, id: panelId, className: "cdt-menu-panel", role: "group", "aria-label": title, children: columns.filter((c) => c.canHide).map((column) => {
          const visible = !hiddenColumns.includes(column.key);
          return /* @__PURE__ */ jsxs8("label", { className: "cdt-menu-item", children: [
            /* @__PURE__ */ jsx8(
              "input",
              {
                type: "checkbox",
                className: "cdt-checkbox",
                checked: visible,
                disabled: visible && visibleCount <= 1,
                onChange: () => onToggle(column.key)
              }
            ),
            /* @__PURE__ */ jsx8("span", { children: column.label })
          ] }, column.key);
        }) })
      ]
    }
  );
}

// src/components/Toolbar.tsx
import { Fragment as Fragment2, jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
function Toolbar({
  table,
  labels,
  searchable,
  searchPlaceholder,
  filters,
  toolbarActions,
  columnToggle,
  showSortSelect,
  className,
  searchClassName
}) {
  const searchId = useId3();
  const sortableColumns = table.visibleColumns.filter((c) => c.canSort);
  const hideableColumns = table.columns.filter((c) => c.canHide);
  return /* @__PURE__ */ jsxs9("div", { className: cx("cdt-toolbar", className), children: [
    /* @__PURE__ */ jsxs9("div", { className: "cdt-toolbar-start", children: [
      searchable && /* @__PURE__ */ jsxs9("div", { className: cx("cdt-search", searchClassName), role: "search", children: [
        /* @__PURE__ */ jsx9("label", { htmlFor: searchId, className: "cdt-sr-only", children: labels.searchLabel }),
        /* @__PURE__ */ jsx9(SearchIcon, {}),
        /* @__PURE__ */ jsx9(
          "input",
          {
            id: searchId,
            type: "search",
            className: "cdt-input",
            placeholder: searchPlaceholder != null ? searchPlaceholder : labels.searchPlaceholder,
            value: table.search,
            onChange: (e) => table.setSearch(e.target.value),
            autoComplete: "off",
            spellCheck: false
          }
        ),
        table.search && /* @__PURE__ */ jsx9(
          "button",
          {
            type: "button",
            className: "cdt-search-clear",
            onClick: () => table.setSearch(""),
            "aria-label": labels.clearSearch,
            title: labels.clearSearch,
            children: /* @__PURE__ */ jsx9(CloseIcon, {})
          }
        )
      ] }),
      filters && /* @__PURE__ */ jsx9("div", { className: "cdt-filters", children: filters })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "cdt-toolbar-end", children: [
      showSortSelect && sortableColumns.length > 0 && /* @__PURE__ */ jsx9(SortSelect, { columns: sortableColumns, table, labels }),
      toolbarActions,
      columnToggle && hideableColumns.length > 1 && /* @__PURE__ */ jsx9(
        ColumnMenu,
        {
          columns: table.columns,
          hiddenColumns: table.hiddenColumns,
          onToggle: table.toggleColumnVisibility,
          label: labels.columns,
          title: labels.toggleColumns
        }
      )
    ] })
  ] });
}
function SortSelect({
  columns,
  table,
  labels
}) {
  const id = useId3();
  const current = table.sort[0];
  const value = current ? `${current.direction}:${current.key}` : "";
  return /* @__PURE__ */ jsxs9(Fragment2, { children: [
    /* @__PURE__ */ jsx9("label", { htmlFor: id, className: "cdt-sr-only", children: labels.sortBy }),
    /* @__PURE__ */ jsxs9(
      "select",
      {
        id,
        className: "cdt-select cdt-sort-select",
        value,
        onChange: (e) => {
          const next = e.target.value;
          if (!next) return table.setSort([]);
          const separator = next.indexOf(":");
          table.setSort([
            { direction: next.slice(0, separator), key: next.slice(separator + 1) }
          ]);
        },
        children: [
          /* @__PURE__ */ jsxs9("option", { value: "", children: [
            labels.sortBy,
            "\u2026"
          ] }),
          columns.map((column) => [
            /* @__PURE__ */ jsxs9("option", { value: `asc:${column.key}`, children: [
              column.label,
              " \u2191"
            ] }, `asc:${column.key}`),
            /* @__PURE__ */ jsxs9("option", { value: `desc:${column.key}`, children: [
              column.label,
              " \u2193"
            ] }, `desc:${column.key}`)
          ])
        ]
      }
    )
  ] });
}

// src/hooks/useColorScheme.ts
import { useSyncExternalStore } from "react";
var QUERY = "(prefers-color-scheme: dark)";
function canMatchMedia() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}
function subscribe(callback) {
  if (!canMatchMedia()) return () => {
  };
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
var getSnapshot = () => canMatchMedia() && window.matchMedia(QUERY).matches;
var getServerSnapshot = () => false;
function useColorScheme(mode) {
  const prefersDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (mode === "system") return prefersDark ? "dark" : "light";
  return mode;
}

// src/hooks/useContainerWidth.ts
import { useLayoutEffect, useEffect as useEffect3, useState as useState3 } from "react";
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect3;
function useContainerWidth(ref) {
  const [width, setWidth] = useState3(null);
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setWidth(element.getBoundingClientRect().width || null);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

// src/hooks/useDataTable.ts
import { useCallback as useCallback2, useEffect as useEffect5, useMemo, useRef as useRef4 } from "react";

// src/core/value.ts
function getValue(row, key) {
  if (row == null || typeof row !== "object") return void 0;
  const record = row;
  if (key in record) return record[key];
  if (!key.includes(".")) return void 0;
  let current = record;
  for (const part of key.split(".")) {
    if (current == null || typeof current !== "object") return void 0;
    current = current[part];
  }
  return current;
}
function humanize(key) {
  var _a;
  const last = (_a = key.split(".").pop()) != null ? _a : key;
  const words = last.replace(/[_-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim().toLowerCase();
  if (words === "id") return "ID";
  return words.charAt(0).toUpperCase() + words.slice(1);
}
function isEmptyValue(value) {
  return value === null || value === void 0 || value === "";
}
function toSearchText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : `${value.toISOString()} ${value.toLocaleDateString()}`;
  }
  if (Array.isArray(value)) return value.map(toSearchText).join(" ");
  return "";
}

// src/core/columns.ts
var SAMPLE_SIZE = 25;
function inferColumns(data) {
  const first = data.find((row) => row != null && typeof row === "object");
  if (!first) return [];
  return Object.keys(first).filter((key) => {
    const value = first[key];
    return value === null || typeof value !== "object" || value instanceof Date || Array.isArray(value);
  }).map((key) => ({ key }));
}
function mapsToData(column, data) {
  if (column.accessor || column.compare || column.searchValue) return true;
  if (data.length === 0) return !column.render;
  const sample = data.length > SAMPLE_SIZE ? data.slice(0, SAMPLE_SIZE) : data;
  return sample.some((row) => getValue(row, column.key) !== void 0);
}
function resolveColumns(columns, data, tableSortable, tableSearchable) {
  const source = columns != null ? columns : inferColumns(data);
  return source.map((column) => {
    var _a, _b, _c, _d;
    const isData = mapsToData(column, data);
    const label = (_a = column.label) != null ? _a : typeof column.header === "string" ? column.header : humanize(column.key);
    const accessor = column.accessor;
    return {
      ...column,
      label,
      canSort: tableSortable && ((_b = column.sortable) != null ? _b : isData),
      canSearch: tableSearchable && ((_c = column.searchable) != null ? _c : isData),
      canHide: (_d = column.hideable) != null ? _d : true,
      read: accessor ? (row) => accessor(row) : (row) => getValue(row, column.key)
    };
  });
}

// src/core/search.ts
function searchRows(rows, query, columns, searchFn) {
  const trimmed = query.trim();
  if (!trimmed) return rows;
  if (searchFn) return rows.filter((row) => searchFn(row, trimmed));
  const terms = trimmed.toLowerCase().split(/\s+/);
  const searchable = columns.filter((c) => c.canSearch);
  return rows.filter((row) => {
    const haystack = searchable.map((c) => c.searchValue ? c.searchValue(row) : toSearchText(c.read(row))).join("\0").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

// src/core/sort.ts
var collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
function compareValues(a, b) {
  if (a === b) return 0;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "bigint" && typeof b === "bigint") return a < b ? -1 : 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "boolean" && typeof b === "boolean") return a ? 1 : -1;
  return collator.compare(String(a), String(b));
}
function sortRows(rows, sort, columns) {
  if (sort.length === 0 || rows.length < 2) return rows;
  const active = sort.map((item) => ({ item, column: columns.find((c) => c.key === item.key) })).filter(
    (entry) => Boolean(entry.column && entry.column.canSort)
  );
  if (active.length === 0) return rows;
  return [...rows].sort((rowA, rowB) => {
    for (const { item, column } of active) {
      const direction = item.direction === "desc" ? -1 : 1;
      if (column.compare) {
        const result2 = column.compare(rowA, rowB);
        if (result2 !== 0) return result2 * direction;
        continue;
      }
      const a = column.read(rowA);
      const b = column.read(rowB);
      const aEmpty = isEmptyValue(a);
      const bEmpty = isEmptyValue(b);
      if (aEmpty || bEmpty) {
        if (aEmpty && bEmpty) continue;
        return aEmpty ? 1 : -1;
      }
      const result = compareValues(a, b);
      if (result !== 0) return result * direction;
    }
    return 0;
  });
}
function nextSort(sort, key, additive) {
  const existing = sort.find((s) => s.key === key);
  if (additive) {
    if (!existing) return [...sort, { key, direction: "asc" }];
    if (existing.direction === "asc") {
      return sort.map((s) => s.key === key ? { key, direction: "desc" } : s);
    }
    return sort.filter((s) => s.key !== key);
  }
  if (!existing) return [{ key, direction: "asc" }];
  if (existing.direction === "asc") return [{ key, direction: "desc" }];
  return [];
}

// src/hooks/useControllableState.ts
import { useCallback, useRef as useRef3, useState as useState4 } from "react";
function useControllableState(value, defaultValue, onChange) {
  const [internal, setInternal] = useState4(defaultValue);
  const isControlled = value !== void 0;
  const current = isControlled ? value : internal;
  const currentRef = useRef3(current);
  currentRef.current = current;
  const onChangeRef = useRef3(onChange);
  onChangeRef.current = onChange;
  const setValue = useCallback(
    (next) => {
      var _a;
      const resolved = typeof next === "function" ? next(currentRef.current) : next;
      if (Object.is(resolved, currentRef.current)) return;
      currentRef.current = resolved;
      if (!isControlled) setInternal(resolved);
      (_a = onChangeRef.current) == null ? void 0 : _a.call(onChangeRef, resolved);
    },
    [isControlled]
  );
  return [current, setValue];
}

// src/hooks/useDebouncedValue.ts
import { useEffect as useEffect4, useState as useState5 } from "react";
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState5(value);
  useEffect4(() => {
    if (delay <= 0) return;
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return delay <= 0 ? value : debounced;
}

// src/hooks/useDataTable.ts
function defaultRowKey(row, index) {
  const id = row != null && typeof row === "object" ? row.id : void 0;
  return typeof id === "string" || typeof id === "number" ? id : index;
}
var EMPTY = [];
function useDataTable(options) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const {
    data = EMPTY,
    serverSide = false,
    searchable = true,
    sortable = true,
    multiSort = true,
    pagination = true,
    selectable = false,
    expandable = false,
    isRowSelectable,
    isRowExpandable,
    rowKey
  } = options;
  const columns = useMemo(
    () => resolveColumns(options.columns, data, sortable, searchable),
    [options.columns, data, sortable, searchable]
  );
  const rowKeyRef = useRef4(rowKey);
  rowKeyRef.current = rowKey;
  const rowKeyProp = typeof rowKey === "string" ? rowKey : null;
  const keyByRow = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    const rk = rowKeyRef.current;
    data.forEach((row, index) => {
      const key = typeof rk === "function" ? rk(row, index) : typeof rk === "string" ? getValue(row, rk) : defaultRowKey(row, index);
      map.set(row, key);
    });
    return map;
  }, [data, rowKeyProp]);
  const rowCache = useRef4(/* @__PURE__ */ new Map());
  useMemo(() => {
    keyByRow.forEach((key, row) => rowCache.current.set(key, row));
  }, [keyByRow]);
  const [search, setSearch] = useControllableState(
    options.search,
    (_a = options.defaultSearch) != null ? _a : "",
    options.onSearchChange
  );
  const debounced = useDebouncedValue(search, (_b = options.searchDebounce) != null ? _b : serverSide ? 300 : 0);
  const appliedSearch = search.trim() === "" ? "" : debounced;
  const [sort, setSortState] = useControllableState(
    options.sort,
    (_c = options.defaultSort) != null ? _c : [],
    options.onSortChange
  );
  const [rawPage, setPageState] = useControllableState(
    options.page,
    (_d = options.defaultPage) != null ? _d : 1,
    options.onPageChange
  );
  const [pageSize, setPageSizeState] = useControllableState(
    options.pageSize,
    (_e = options.defaultPageSize) != null ? _e : 10,
    options.onPageSizeChange
  );
  const setSort = useCallback2(
    (next) => {
      setSortState(next);
      setPageState(1);
    },
    [setSortState, setPageState]
  );
  const toggleSort = useCallback2(
    (key, additive = false) => setSort(nextSort(sort, key, additive && multiSort)),
    [setSort, sort, multiSort]
  );
  const setPageSize = useCallback2(
    (size) => {
      setPageSizeState(size);
      setPageState(1);
    },
    [setPageSizeState, setPageState]
  );
  const filtered = useMemo(
    () => serverSide ? data : searchRows(data, appliedSearch, columns, options.searchFn),
    [serverSide, data, appliedSearch, columns, options.searchFn]
  );
  const processedRows = useMemo(
    () => serverSide ? filtered : sortRows(filtered, sort, columns),
    [serverSide, filtered, sort, columns]
  );
  const totalRows = serverSide ? (_f = options.totalRows) != null ? _f : data.length : processedRows.length;
  const pageCount = pagination ? getPageCount(totalRows, pageSize) : 1;
  const page = serverSide ? Math.max(1, rawPage) : clamp(rawPage, 1, pageCount);
  const pageRows = useMemo(() => {
    if (serverSide || !pagination) return processedRows;
    const start = (page - 1) * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [serverSide, pagination, processedRows, page, pageSize]);
  const rows = useMemo(
    () => pageRows.map((row, index) => {
      var _a2;
      return { row, key: (_a2 = keyByRow.get(row)) != null ? _a2 : index, index };
    }),
    [pageRows, keyByRow]
  );
  const from = totalRows === 0 ? 0 : pagination ? (page - 1) * pageSize + 1 : 1;
  const to = pagination ? Math.min(from + rows.length - 1, totalRows) : totalRows;
  const query = useMemo(
    () => ({ page, pageSize, search: appliedSearch, sort }),
    [page, pageSize, appliedSearch, sort]
  );
  const lastSearch = useRef4(appliedSearch);
  const lastQueryKey = useRef4(null);
  const onQueryChangeRef = useRef4(options.onQueryChange);
  onQueryChangeRef.current = options.onQueryChange;
  useEffect5(() => {
    let effective = query;
    if (lastSearch.current !== appliedSearch) {
      lastSearch.current = appliedSearch;
      if (query.page !== 1) {
        setPageState(1);
        effective = { ...query, page: 1 };
      }
    }
    if (!onQueryChangeRef.current) return;
    const key = JSON.stringify(effective);
    if (key === lastQueryKey.current) return;
    lastQueryKey.current = key;
    onQueryChangeRef.current(effective);
  }, [query, appliedSearch, setPageState]);
  const [hiddenColumns, setHiddenColumns] = useControllableState(
    options.hiddenColumns,
    () => {
      var _a2, _b2;
      return (_b2 = options.defaultHiddenColumns) != null ? _b2 : ((_a2 = options.columns) != null ? _a2 : []).filter((c) => c.hidden).map((c) => c.key);
    },
    options.onHiddenColumnsChange
  );
  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenColumns.includes(c.key)),
    [columns, hiddenColumns]
  );
  const toggleColumnVisibility = useCallback2(
    (key) => setHiddenColumns((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]),
    [setHiddenColumns]
  );
  const selectionMode = selectable === "single" ? "single" : selectable ? "multiple" : null;
  const onSelectionChange = options.onSelectionChange;
  const [selectedKeys, setSelectedKeys] = useControllableState(
    options.selectedKeys,
    (_g = options.defaultSelectedKeys) != null ? _g : [],
    onSelectionChange ? (keys) => onSelectionChange(
      keys,
      keys.map((k) => rowCache.current.get(k)).filter((r) => r !== void 0)
    ) : void 0
  );
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const isSelected = useCallback2((key) => selectedSet.has(key), [selectedSet]);
  const canSelectRow = useCallback2(
    (row) => selectionMode !== null && (isRowSelectable ? isRowSelectable(row) : true),
    [selectionMode, isRowSelectable]
  );
  const toggleRowSelection = useCallback2(
    (key) => setSelectedKeys((prev) => {
      if (selectionMode === "single") return prev.includes(key) ? [] : [key];
      return prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
    }),
    [setSelectedKeys, selectionMode]
  );
  const pageSelectableKeys = useMemo(
    () => rows.filter((r) => canSelectRow(r.row)).map((r) => r.key),
    [rows, canSelectRow]
  );
  const selectedOnPage = pageSelectableKeys.filter((k) => selectedSet.has(k)).length;
  const pageSelectionState = selectedOnPage === 0 ? "none" : selectedOnPage === pageSelectableKeys.length ? "all" : "some";
  const togglePageSelection = useCallback2(() => {
    setSelectedKeys((prev) => {
      const pageKeys = new Set(pageSelectableKeys);
      const allSelected = pageSelectableKeys.every((k) => prev.includes(k));
      if (allSelected) return prev.filter((k) => !pageKeys.has(k));
      return [...prev, ...pageSelectableKeys.filter((k) => !prev.includes(k))];
    });
  }, [setSelectedKeys, pageSelectableKeys]);
  const matchingSelectableKeys = useMemo(
    () => serverSide || selectionMode !== "multiple" ? [] : processedRows.filter((r) => canSelectRow(r)).map((r, i) => {
      var _a2;
      return (_a2 = keyByRow.get(r)) != null ? _a2 : i;
    }),
    [serverSide, selectionMode, processedRows, canSelectRow, keyByRow]
  );
  const selectAllMatching = useCallback2(() => {
    setSelectedKeys((prev) => [...prev, ...matchingSelectableKeys.filter((k) => !prev.includes(k))]);
  }, [setSelectedKeys, matchingSelectableKeys]);
  const clearSelection = useCallback2(() => setSelectedKeys([]), [setSelectedKeys]);
  const selectedRows = useMemo(
    () => selectedKeys.map((k) => rowCache.current.get(k)).filter((r) => r !== void 0),
    // rowCache is refreshed whenever keyByRow changes.
    [selectedKeys, keyByRow]
  );
  const [expandedKeys, setExpandedKeys] = useControllableState(
    options.expandedKeys,
    (_h = options.defaultExpandedKeys) != null ? _h : [],
    options.onExpandedChange
  );
  const expandedSet = useMemo(() => new Set(expandedKeys), [expandedKeys]);
  const isExpanded = useCallback2((key) => expandedSet.has(key), [expandedSet]);
  const canExpandRow = useCallback2(
    (row) => expandable && (isRowExpandable ? isRowExpandable(row) : true),
    [expandable, isRowExpandable]
  );
  const toggleExpanded = useCallback2(
    (key) => setExpandedKeys((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]),
    [setExpandedKeys]
  );
  const getSortState = useCallback2(
    (key) => {
      const index = sort.findIndex((s) => s.key === key);
      return index === -1 ? void 0 : { direction: sort[index].direction, index: index + 1 };
    },
    [sort]
  );
  return {
    columns,
    visibleColumns,
    rows,
    processedRows,
    totalRows,
    serverSide,
    search,
    appliedSearch,
    setSearch,
    sort,
    setSort,
    toggleSort,
    getSortState,
    paginated: pagination,
    page,
    pageSize,
    pageCount,
    from,
    to,
    setPage: setPageState,
    setPageSize,
    hiddenColumns,
    setHiddenColumns,
    toggleColumnVisibility,
    selectionMode,
    selectedKeys,
    selectedRows,
    isSelected,
    canSelectRow,
    toggleRowSelection,
    togglePageSelection,
    pageSelectionState,
    matchingSelectableCount: matchingSelectableKeys.length,
    selectAllMatching,
    clearSelection,
    expandable,
    isExpanded,
    canExpandRow,
    toggleExpanded,
    query
  };
}

// src/themes/presets.ts
var defaultTheme = { name: "default" };
var minimal = {
  name: "minimal",
  tokens: {
    background: "transparent",
    headerBackground: "transparent",
    rowHoverBackground: "#f9fafb",
    expandedBackground: "#f9fafb",
    border: "#eef0f3",
    borderStrong: "#d6d9de",
    accent: "#111827",
    radius: "0px",
    controlRadius: "6px",
    badgeRadius: "4px",
    borderWidth: "0px",
    shadow: "none",
    cellPaddingX: "12px",
    cellPaddingY: "14px",
    headerFontSize: "11px",
    headerFontWeight: "600",
    headerTextTransform: "uppercase",
    headerLetterSpacing: "0.06em",
    headerText: "#6b7280"
  },
  darkTokens: {
    background: "transparent",
    headerBackground: "transparent",
    rowHoverBackground: "rgba(255, 255, 255, 0.03)",
    accent: "#f3f4f6",
    accentText: "#111827",
    headerText: "#9ca3af",
    border: "#23272f"
  }
};
var modern = {
  name: "modern",
  tokens: {
    accent: "#5b5bd6",
    background: "#ffffff",
    headerBackground: "#ffffff",
    rowHoverBackground: "#f7f7fd",
    expandedBackground: "#fafaff",
    border: "#eceef3",
    radius: "18px",
    controlRadius: "10px",
    borderWidth: "1px",
    shadow: "0 1px 3px rgba(16, 24, 40, 0.05), 0 12px 32px -12px rgba(16, 24, 40, 0.12)",
    cellPaddingX: "20px",
    cellPaddingY: "15px",
    headerPaddingY: "13px",
    rowHeight: "56px",
    controlHeight: "38px",
    gap: "14px",
    headerFontSize: "12px",
    headerFontWeight: "600",
    headerTextTransform: "uppercase",
    headerLetterSpacing: "0.05em",
    headerText: "#7a8194",
    titleFontSize: "18px"
  },
  darkTokens: {
    accent: "#8b8bff",
    accentText: "#14142b",
    background: "#15161f",
    headerBackground: "#15161f",
    rowHoverBackground: "#1c1d29",
    expandedBackground: "#181924",
    controlBackground: "#1a1b26",
    popoverBackground: "#1d1e2a",
    border: "#262838",
    headerText: "#8d93a8",
    shadow: "0 1px 3px rgba(0, 0, 0, 0.4), 0 12px 32px -12px rgba(0, 0, 0, 0.7)"
  }
};
var compact = {
  name: "compact",
  tokens: {
    headerBackground: "#f3f4f6",
    rowStripeBackground: "#fafbfc",
    radius: "6px",
    controlRadius: "5px",
    badgeRadius: "4px",
    columnBorderWidth: "1px",
    cellPaddingX: "10px",
    cellPaddingY: "6px",
    headerPaddingY: "7px",
    rowHeight: "34px",
    controlHeight: "30px",
    gap: "8px",
    fontSize: "13px",
    headerFontSize: "12px",
    titleFontSize: "15px"
  },
  darkTokens: {
    headerBackground: "#1a1e25",
    rowStripeBackground: "rgba(255, 255, 255, 0.02)"
  }
};
var dark = {
  name: "dark",
  forcedMode: "dark",
  darkTokens: {
    background: "#0d1117",
    headerBackground: "#121821",
    rowHoverBackground: "#161d28",
    expandedBackground: "#10161e",
    controlBackground: "#121821",
    popoverBackground: "#161d28",
    border: "#1f2733",
    borderStrong: "#2d3746",
    text: "#e6edf3",
    textMuted: "#8b97a7",
    headerText: "#b6c2d1",
    accent: "#3d8bfd",
    skeleton: "#1c2430",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.5), 0 10px 30px -12px rgba(0, 0, 0, 0.7)"
  }
};
var glass = {
  name: "glass",
  tokens: {
    background: "rgba(255, 255, 255, 0.55)",
    headerBackground: "rgba(255, 255, 255, 0.45)",
    rowHoverBackground: "rgba(255, 255, 255, 0.55)",
    expandedBackground: "rgba(255, 255, 255, 0.35)",
    controlBackground: "rgba(255, 255, 255, 0.6)",
    popoverBackground: "rgba(255, 255, 255, 0.92)",
    rowSelectedBackground: "color-mix(in srgb, var(--cdt-accent) 12%, transparent)",
    border: "rgba(255, 255, 255, 0.65)",
    borderStrong: "rgba(15, 23, 42, 0.14)",
    accent: "#7c3aed",
    skeleton: "rgba(15, 23, 42, 0.08)",
    radius: "20px",
    controlRadius: "12px",
    shadow: "0 8px 32px rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(18px) saturate(160%)",
    cellPaddingX: "18px",
    cellPaddingY: "13px"
  },
  darkTokens: {
    background: "rgba(17, 24, 39, 0.5)",
    headerBackground: "rgba(17, 24, 39, 0.35)",
    rowHoverBackground: "rgba(255, 255, 255, 0.05)",
    expandedBackground: "rgba(0, 0, 0, 0.15)",
    controlBackground: "rgba(255, 255, 255, 0.06)",
    popoverBackground: "rgba(23, 28, 40, 0.94)",
    rowSelectedBackground: "color-mix(in srgb, var(--cdt-accent) 20%, transparent)",
    border: "rgba(255, 255, 255, 0.1)",
    borderStrong: "rgba(255, 255, 255, 0.18)",
    accent: "#a78bfa",
    accentText: "#1e1033",
    skeleton: "rgba(255, 255, 255, 0.08)",
    shadow: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
  }
};
var themes = {
  default: defaultTheme,
  minimal,
  modern,
  compact,
  dark,
  glass
};

// src/themes/tokens.ts
var baseTokens = {
  background: "#ffffff",
  headerBackground: "#f8fafc",
  rowHoverBackground: "#f5f7fa",
  rowStripeBackground: "transparent",
  rowSelectedBackground: "color-mix(in srgb, var(--cdt-accent) 8%, var(--cdt-background))",
  expandedBackground: "#fafbfc",
  controlBackground: "#ffffff",
  popoverBackground: "#ffffff",
  border: "#e6e8ec",
  borderStrong: "#d0d5dd",
  text: "#101828",
  textMuted: "#667085",
  headerText: "#344054",
  accent: "#2563eb",
  accentText: "#ffffff",
  success: "#079455",
  warning: "#dc6803",
  danger: "#d92d20",
  info: "#0086c9",
  focusRing: "color-mix(in srgb, var(--cdt-accent) 55%, transparent)",
  skeleton: "#eef0f3",
  radius: "12px",
  controlRadius: "8px",
  badgeRadius: "999px",
  borderWidth: "1px",
  rowBorderWidth: "1px",
  columnBorderWidth: "0px",
  shadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
  popoverShadow: "0 12px 24px -6px rgba(16, 24, 40, 0.14), 0 4px 8px -2px rgba(16, 24, 40, 0.06)",
  backdropFilter: "none",
  cellPaddingX: "16px",
  cellPaddingY: "12px",
  headerPaddingY: "11px",
  rowHeight: "48px",
  controlHeight: "36px",
  gap: "12px",
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: "14px",
  lineHeight: "1.45",
  headerFontSize: "13px",
  headerFontWeight: "600",
  headerTextTransform: "none",
  headerLetterSpacing: "0",
  titleFontSize: "16px",
  transition: "140ms ease"
};
var baseDarkTokens = {
  background: "#13161c",
  headerBackground: "#181c23",
  rowHoverBackground: "#1c212a",
  rowStripeBackground: "transparent",
  rowSelectedBackground: "color-mix(in srgb, var(--cdt-accent) 16%, var(--cdt-background))",
  expandedBackground: "#161a20",
  controlBackground: "#181c23",
  popoverBackground: "#1c2028",
  border: "#272c36",
  borderStrong: "#363c48",
  text: "#e8eaee",
  textMuted: "#98a0ad",
  headerText: "#c5cad3",
  accent: "#4b8bff",
  accentText: "#ffffff",
  success: "#3ccb7f",
  warning: "#f5a524",
  danger: "#f97066",
  info: "#36bffa",
  skeleton: "#232833",
  shadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
  popoverShadow: "0 16px 32px -8px rgba(0, 0, 0, 0.6)"
};

// src/themes/createTheme.ts
function toTheme(input) {
  var _a;
  if (!input) return themes.default;
  if (typeof input === "string") return (_a = themes[input]) != null ? _a : themes.default;
  return input;
}
function createTheme(options = {}) {
  var _a, _b, _c;
  const { extends: base, ...overrides } = options;
  const parent = toTheme(base);
  return {
    name: (_b = (_a = overrides.name) != null ? _a : parent.name) != null ? _b : "custom",
    forcedMode: (_c = overrides.forcedMode) != null ? _c : parent.forcedMode,
    tokens: { ...parent.tokens, ...overrides.tokens },
    darkTokens: { ...parent.darkTokens, ...overrides.darkTokens }
  };
}
function toVarName(token) {
  return `--cdt-${token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}
function resolveTheme(input, mode) {
  var _a, _b;
  const theme = toTheme(input);
  const effectiveMode = (_a = theme.forcedMode) != null ? _a : mode;
  const tokens = effectiveMode === "dark" ? { ...baseTokens, ...theme.tokens, ...baseDarkTokens, ...theme.darkTokens } : { ...baseTokens, ...theme.tokens };
  const style = {};
  for (const key of Object.keys(tokens)) {
    style[toVarName(key)] = tokens[key];
  }
  return { name: (_b = theme.name) != null ? _b : "custom", mode: effectiveMode, tokens, style };
}

// src/DataTable.tsx
import { jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
var DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
var NO_CLASSNAMES = {};
function errorMessage(error, fallback) {
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === "string") return error;
  if (error === true) return fallback;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return fallback;
}
function DataTable(props) {
  const {
    theme = "default",
    colorMode = "light",
    className,
    classNames = NO_CLASSNAMES,
    style,
    title,
    description,
    searchable = true,
    searchPlaceholder,
    filters,
    toolbarActions,
    columnToggle = true,
    rowActions,
    renderExpanded,
    bulkActions,
    loading = false,
    error,
    onRetry,
    loadingState,
    emptyState,
    errorState,
    pagination = true,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    renderPagination,
    stickyHeader = false,
    maxHeight,
    responsive = "scroll",
    breakpoint = 640,
    ariaLabel,
    caption
  } = props;
  const table = useDataTable({ ...props, expandable: Boolean(renderExpanded) });
  const labels = useMemo2(() => ({ ...defaultLabels, ...props.labels }), [props.labels]);
  const idPrefix = useId4().replace(/:/g, "");
  const titleId = `${idPrefix}-title`;
  const mode = useColorScheme(colorMode);
  const resolved = useMemo2(() => resolveTheme(theme, mode), [theme, mode]);
  const rootRef = useRef5(null);
  const width = useContainerWidth(rootRef);
  const isNarrow = width !== null && width < breakpoint;
  const view = isNarrow && responsive === "cards" ? "cards" : "table";
  const displayColumns = isNarrow ? table.visibleColumns.filter((c) => !c.hideOnMobile) : table.visibleColumns;
  const [announcement, setAnnouncement] = useState6("");
  const sortSignature = JSON.stringify(table.sort);
  const isFirstRender = useRef5(true);
  useEffect6(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const first = table.sort[0];
    const column = first && table.columns.find((c) => c.key === first.key);
    setAnnouncement(
      column ? first.direction === "asc" ? labels.sortedAscending(column.label) : labels.sortedDescending(column.label) : labels.sortCleared
    );
  }, [sortSignature]);
  const lastSearch = useRef5(table.appliedSearch);
  useEffect6(() => {
    if (lastSearch.current === table.appliedSearch || loading) return;
    lastSearch.current = table.appliedSearch;
    setAnnouncement(labels.resultsCount(table.totalRows));
  }, [table.appliedSearch, table.totalRows, loading, labels]);
  const hasRows = table.rows.length > 0;
  let body;
  if (loading && !hasRows) {
    body = loadingState ? { kind: "message", content: loadingState } : { kind: "skeleton" };
  } else if (error && !loading) {
    body = {
      kind: "message",
      content: typeof errorState === "function" ? errorState(error) : errorState != null ? errorState : /* @__PURE__ */ jsx10(
        StateMessage,
        {
          tone: "danger",
          role: "alert",
          icon: /* @__PURE__ */ jsx10(AlertIcon, {}),
          title: errorMessage(error, labels.error),
          action: onRetry && /* @__PURE__ */ jsx10("button", { type: "button", className: "cdt-btn", onClick: onRetry, children: labels.retry })
        }
      )
    };
  } else if (!hasRows) {
    const searching = table.appliedSearch !== "";
    body = {
      kind: "message",
      content: emptyState && !searching ? emptyState : /* @__PURE__ */ jsx10(
        StateMessage,
        {
          role: "status",
          icon: /* @__PURE__ */ jsx10(InboxIcon, {}),
          title: searching ? labels.noResults(table.appliedSearch) : labels.empty,
          action: searching && /* @__PURE__ */ jsx10("button", { type: "button", className: "cdt-btn", onClick: () => table.setSearch(""), children: labels.clearSearch })
        }
      )
    };
  } else {
    body = { kind: "rows" };
  }
  const viewProps = {
    table,
    columns: displayColumns,
    labels,
    classNames,
    body,
    loading,
    idPrefix,
    rowActions,
    renderExpanded,
    onRowClick: props.onRowClick,
    rowClassName: props.rowClassName,
    skeletonRows: Math.min(table.pageSize, 6)
  };
  const paginationProps = {
    page: table.page,
    pageSize: table.pageSize,
    pageCount: table.pageCount,
    totalRows: table.totalRows,
    from: table.from,
    to: table.to,
    pageSizeOptions,
    canPreviousPage: table.page > 1,
    canNextPage: table.page < table.pageCount,
    setPage: table.setPage,
    setPageSize: table.setPageSize
  };
  const showToolbar = searchable || Boolean(filters) || Boolean(toolbarActions) || columnToggle && table.columns.filter((c) => c.canHide).length > 1;
  const showBulkBar = table.selectionMode !== null && table.selectedKeys.length > 0;
  const showPagination = pagination && (table.totalRows > 0 || renderPagination !== void 0);
  const rootStyle = {
    ...resolved.style,
    ...stickyHeader && maxHeight !== void 0 ? { "--cdt-max-height": toCssSize(maxHeight) } : null,
    ...style
  };
  return /* @__PURE__ */ jsxs10(
    "div",
    {
      ref: rootRef,
      className: cx("cdt", className, classNames.root),
      style: rootStyle,
      "data-cdt-theme": resolved.name,
      "data-cdt-mode": resolved.mode,
      "data-cdt-view": view,
      "data-cdt-narrow": isNarrow || void 0,
      "data-cdt-compact": isNarrow && responsive === "compact" || void 0,
      "data-cdt-sticky": stickyHeader || void 0,
      children: [
        (title || description) && /* @__PURE__ */ jsxs10("div", { className: cx("cdt-header", classNames.header), children: [
          title && /* @__PURE__ */ jsx10("div", { className: "cdt-title", id: titleId, children: title }),
          description && /* @__PURE__ */ jsx10("div", { className: "cdt-description", children: description })
        ] }),
        showToolbar && /* @__PURE__ */ jsx10(
          Toolbar,
          {
            table,
            labels,
            searchable,
            searchPlaceholder,
            filters,
            toolbarActions,
            columnToggle,
            showSortSelect: view === "cards" && props.sortable !== false,
            className: classNames.toolbar,
            searchClassName: classNames.search
          }
        ),
        showBulkBar && /* @__PURE__ */ jsx10(BulkBar, { table, labels, bulkActions, className: classNames.bulkBar }),
        /* @__PURE__ */ jsxs10("div", { className: cx("cdt-container", classNames.container), children: [
          loading && hasRows && /* @__PURE__ */ jsx10("div", { className: "cdt-progress", role: "progressbar", "aria-label": labels.loading }),
          view === "cards" ? /* @__PURE__ */ jsx10(CardView, { ...viewProps, labelledBy: title ? titleId : void 0, ariaLabel }) : /* @__PURE__ */ jsx10(
            TableView,
            {
              ...viewProps,
              labelledBy: title ? titleId : void 0,
              ariaLabel,
              caption
            }
          )
        ] }),
        showPagination && /* @__PURE__ */ jsx10("div", { className: cx("cdt-footer", classNames.footer), children: renderPagination ? renderPagination(paginationProps) : /* @__PURE__ */ jsx10(
          Pagination,
          {
            ...paginationProps,
            labels,
            compact: isNarrow,
            className: classNames.pagination
          }
        ) }),
        /* @__PURE__ */ jsx10("div", { className: "cdt-sr-only", role: "status", "aria-live": "polite", "aria-atomic": "true", children: loading ? labels.loading : announcement })
      ]
    }
  );
}

// src/components/Badge.tsx
import { jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
function Badge({ tone = "neutral", dot = false, className, children, ...rest }) {
  return /* @__PURE__ */ jsxs11("span", { className: cx("cdt-badge", `cdt-badge--${tone}`, className), ...rest, children: [
    dot && /* @__PURE__ */ jsx11("span", { className: "cdt-badge-dot", "aria-hidden": "true" }),
    children
  ] });
}
function renderBadge(tones, options = {}) {
  const { dot = true, fallback = "neutral", format } = options;
  return (value) => {
    var _a, _b;
    if (value === null || value === void 0 || value === "") return null;
    const text = String(value);
    return /* @__PURE__ */ jsx11(Badge, { tone: (_b = (_a = tones[text]) != null ? _a : tones[text.toLowerCase()]) != null ? _b : fallback, dot, children: format ? format(value) : text });
  };
}
export {
  Badge,
  DataTable,
  Pagination,
  baseDarkTokens,
  baseTokens,
  compareValues,
  createTheme,
  defaultLabels,
  getValue,
  humanize,
  renderBadge,
  resolveTheme,
  searchRows,
  sortRows,
  themes,
  useDataTable
};
//# sourceMappingURL=index.js.map