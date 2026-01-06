import SearchIcon from "@mui/icons-material/Search";
import {InputAdornment, TextField} from "@mui/material";
import React, {useMemo, useState} from "react";
import { norm } from "../../utils/format";

export type Option = {
  type: string | null;
  id: string;
  name: string;
  label: string; // ข้อความโชว์ในรายการ
  code: string | null;
  group_bu_id: string | null;
  domain: string | null;
  company_id: string | null;
  position: string | null;
  manager_id: string | null;
  manager_name: string | null;
  email: string | null;
  is_manager: number

};

interface CustomMultiSelectProps {
  options?: Option[];
  selected?: Option[];
  onChange: React.Dispatch<React.SetStateAction<Option[]>>;
  label?: string;
  disabledPositions?: string[];
  required?: boolean;
  validate?: boolean;

}
const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options = [],
  selected = [],
  onChange,
  label,
  disabledPositions = [],
  required,
  validate
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const disabledSet = useMemo(
    () => new Set(disabledPositions.map((p) => p.trim().toLowerCase())),
    [disabledPositions]
  );

  const isDisabled = (opt: Option) =>
    disabledSet.has((opt.position ?? "").trim().toLowerCase());


  const selectableOptions = useMemo(
    () => options.filter((o) => !isDisabled(o)),
    [options, disabledSet]
  );

  const selectedIdSet = useMemo(
    () => new Set((selected ?? []).map(s => norm(s.id))),
    [selected]
  );

  const isAllSelected =
    selectableOptions.length > 0 &&
    selectedIdSet.size === selectableOptions.length;

  // กรองตามคำค้นหา
  const filteredOptions = useMemo(() => {
    const term = (searchTerm ?? "").toLowerCase();
    return options.filter((opt) => (opt.label ?? "").toLowerCase().includes(term));
  }, [searchTerm, options]);


  const toggleSelection = (opt: Option) => {
    if (isDisabled(opt)) return;
    const id = norm(opt.id);
    const curr = Array.isArray(selected) ? selected : [];
    if (selectedIdSet.has(id)) {
      onChange(curr.filter((s) => s.id !== id));
    } else {
      onChange([...curr, opt]);
    }
  };

  const selectAll = () => onChange(selectableOptions); // เลือกทั้งหมด (เฉพาะที่เลือกได้)
  const unselectAll = () => onChange([]);              // ล้างทั้งหมด

  return (
    <div className="w-full">
      {label && (
        <label className=" block mb-1 ">
          {label}
          {required && <span className="text-red-600 ml-1 mr-1">*</span>}
        </label>
      )}
      <div
        className={[
          "rounded-md border bg-white max-h-[28rem] p-4 shadow-sm space-y-3",
          validate ? "border-red-500 ring-1 ring-red-300" : "border-gray-300",
        ].join(" ")}
        aria-invalid={!!validate}
      >
        <TextField
          placeholder="ค้นหา..."
          variant="outlined"
          size="small"
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value ?? "")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}

          error={!!validate}
          helperText={" "}
          FormHelperTextProps={{
            sx: {m: 0, mt: .5, fontSize: "11px", lineHeight: 1.2, color: "#d50000"},
          }}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: "12px",
              height: "32px",
              minHeight: "unset",
            },
            "& input": {padding: "6px 8px"},
            "& .MuiOutlinedInput-root": {
              borderRadius: "5px",
              fontSize: "14px",
            },
          }}
        />

        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center space-x-2 mt-4 ml-2">
            <input
              type="checkbox"
              checked={!!isAllSelected}
              onChange={(e) => (e.target.checked ? selectAll() : unselectAll())}
              className="accent-blue-600"
            />
            <span className="text-md">เลือกทั้งหมด</span>
          </label>
          <button
            onClick={unselectAll}
            className="text-sm text-blue-500 underline hover:text-blue-700"
            type="button"
          >
            ล้างการเลือกทั้งหมด
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto pr-1 space-y-2 mt-4">
          {filteredOptions.length === 0 ? (
            <div className="text-gray-400">ไม่พบข้อมูล</div>
          ) : (
            filteredOptions.map((opt) => {
              const checked = selectedIdSet.has(opt?.id?.trim()?.toLowerCase());
              const disabled = isDisabled(opt);
              const isMgr = (v: any) => v === 1 || v === "1" || v === true;
              const mgr = isMgr(opt.is_manager);
              return (
                <div
                  key={opt.id}
                  className={`flex items-start space-x-2 px-2 py-1 rounded-md transition-colors duration-150
                  ${disabled ? "opacity-50" : "cursor-pointer"}
                  ${checked ? "bg-blue-100 text-gray-800 font-semibold" : "hover:bg-gray-100"}`}
                  onClick={() => !disabled && toggleSelection(opt)}
                  title={disabled ? "ไม่สามารถเลือกได้" : ""}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelection(opt);
                    }}
                    id={`checkbox-${opt.id}`}
                    className="mt-1 accent-blue-600"
                    disabled={disabled}
                  />
                  <label htmlFor={`checkbox-${opt.id}`} className="text-md w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{opt.label ?? ""}</span>
                      {mgr && (
                        <span
                          className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ผู้จัดการ
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              );
            })
          )}
        </div>
      </div>
      {validate && (
        <div className=" text-[11px]  text-red-600">กรุณาเลือก</div>
      )}
      <div className="text-semibold text-sm text-right mt-1">
        เลือกแล้ว {selected?.length} / {selectableOptions?.length}
      </div>

    </div>
  );

};

export default CustomMultiSelect;
