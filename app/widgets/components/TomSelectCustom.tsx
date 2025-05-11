import React, { FC, useState, useRef, useEffect } from 'react';

export interface TomOption {
    value: string;
    label: string;
    description?: string;
    iconClass: string; // e.g. "bi-globe" or "bi-lock"
}

interface TomSelectCustomProps {
    id: string;
    options: TomOption[];
    value: string;
    onChange: (value: string) => void;
}

const TomSelectCustom: FC<TomSelectCustomProps> = ({
                                                       id,
                                                       options,
                                                       value,
                                                       onChange,
                                                   }) => {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);

    // close when clicking outside
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (root.current && !root.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const selectedOpt = options.find((o) => o.value === value)!;

    return (
        <div ref={root} className="tom-select-custom">
            {/* native select for accessibility */}
            <select
                id={id}
                className="js-select form-select tomselected ts-hidden-accessible"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>

            {/* custom dropdown */}
            <div
                className={[
                    'ts-wrapper',
                    'js-select',
                    'form-select',
                    'single',
                    'plugin-change_listener',
                    'plugin-hs_smart_position',
                    'full',
                    value ? 'has-items' : '',
                    open ? 'focus input-active dropdown-active' : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-dropdown`}
                onClick={() => setOpen((o) => !o)}
            >
                <div className="ts-control">
                    <div
                        className="d-flex align-items-start item"
                        data-value={selectedOpt.value}
                        data-ts-item=""
                    >
                        <div className="flex-shrink-0">
                            <i className={selectedOpt.iconClass}></i>
                        </div>
                        <div className="flex-grow-1 ms-2">
              <span className="d-block fw-semibold">
                {selectedOpt.label}
              </span>
                            {selectedOpt.description && (
                                <span className="tom-select-custom-hide small">
                  {selectedOpt.description}
                </span>
                            )}
                        </div>
                    </div>
                    <input
                        type="select-one"
                        autoComplete="off"
                        size={1}
                        tabIndex={0}
                        role="combobox"
                        aria-controls={`${id}-dropdown`}
                        aria-expanded={open}
                        aria-activedescendant={`${id}-opt-${selectedOpt.value}`}
                        readOnly
                    />
                </div>

                <div
                    className="ts-dropdown single plugin-change_listener plugin-hs_smart_position"
                    style={{
                        display: open ? 'block' : 'none',
                        visibility: 'visible',
                        opacity: 1,
                        width: 'auto',
                    }}
                >
                    <div
                        role="listbox"
                        tabIndex={-1}
                        className="ts-dropdown-content"
                        id={`${id}-dropdown`}
                    >
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                className={[
                                    'd-flex align-items-start option',
                                    opt.value === value ? 'active selected' : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                data-selectable=""
                                data-value={opt.value}
                                role="option"
                                id={`${id}-opt-${opt.value}`}
                                aria-selected={opt.value === value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                            >
                                <div className="flex-shrink-0">
                                    <i className={opt.iconClass}></i>
                                </div>
                                <div className="flex-grow-1 ms-2">
                                    <span className="d-block fw-semibold">{opt.label}</span>
                                    {opt.description && (
                                        <span className="tom-select-custom-hide small">
                      {opt.description}
                    </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TomSelectCustom;
