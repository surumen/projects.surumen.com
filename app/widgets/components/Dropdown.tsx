import React, { FC, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'react-bootstrap-icons';

export interface DropdownItem {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface BootstrapDropdownProps {
    /** Unique id for aria-linking trigger ↔ menu */
    id: string;
    /** Items to render in the menu */
    items: DropdownItem[];
    /** Currently selected value */
    selected: string | number;
    /** Called when user picks an item */
    onSelect: (value: string | number) => void;
    /** Button + menu width, e.g. "120px" or 120 */
    width?: string | number;
    /** Max height of the menu before scroll kicks in, e.g. "40vh" or 300 */
    menuMaxHeight?: string | number;
}

const Dropdown: FC<BootstrapDropdownProps> = ({
                                                  id,
                                                  items,
                                                  selected,
                                                  onSelect,
                                                  width = 100,
                                                  menuMaxHeight = '50vh',
                                              }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const current = items.find(i => i.value === selected);
    const widthValue = `${width}px`;
    return (
        <div
            ref={ref}
            className={`dropdown${open ? ' show' : ''}`}
            style={{ width: widthValue }}
        >
            <button
                type="button"
                id={id}
                className="btn btn-xs btn-outline-info opacity-75 rounded-2 d-flex align-items-center justify-content-between"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                style={{ width: '100%' }}
            >
                <span className="mx-2">{current?.label}</span>
                <ChevronDown size={8} className="text-xs me-2" />
            </button>

            <ul
                className={`dropdown-menu${open ? ' show' : ''}`}
                aria-labelledby={id}
                style={{
                    width: '100%',         // menu matches button width
                    maxHeight: menuMaxHeight,
                    overflowY: 'auto',
                }}
            >
                {items.map(item => (
                    <li key={item.value}>
                        <button
                            type="button"
                            className={
                                'dropdown-item d-flex justify-content-between bg-info align-items-center ' +
                                (item.value === selected
                                    ? 'active bg-info-subtle text-info'
                                    : 'text-muted bg-white')
                            }
                            disabled={item.disabled}
                            onClick={() => {
                                onSelect(item.value);
                                setOpen(false);
                            }}
                        >
                            <span>{item.label}</span>
                            {item.value === selected && (
                                <Check size={12} className="ms-2 text-info" />
                            )}
                        </button>
                    </li>

                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
