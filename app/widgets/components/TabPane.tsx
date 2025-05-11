import React, { useState, ReactElement, cloneElement } from 'react';

export interface TabHeader {
    key: string;
    label: string;
}

export interface PaneProps {
    eventKey: string;
    children: React.ReactNode;
    className?: string;
}

export const Pane: React.FC<PaneProps> = ({ eventKey, className, children }) => (
    <div
        className={`tab-pane fade ${className || ''}`}
        id={`nav-${eventKey}`}
        role="tabpanel"
        aria-labelledby={`nav-${eventKey}Tab`}
    >
        {children}
    </div>
);

interface TabPaneProps {
    id: string;
    headers: TabHeader[];
    children: ReactElement<PaneProps>[];
}

const TabPane: React.FC<TabPaneProps> & { Pane: typeof Pane } = ({ id, headers, children }) => {
    const [active, setActive] = useState(headers[0].key);

    return (
        <div className="card border-0 shadow-none">
            <div className="card-header pb-0 px-3 border-0">
                <ul className="nav nav-segment w-100" id={`navTab${id}`} role="tablist">
                    {headers.map(h => (
                        <li className="nav-item text-center w-50" role="presentation" key={h.key}>
                            <a
                                className={`nav-link${active === h.key ? ' active' : ''}`}
                                id={`nav-${h.key}Tab`}
                                data-bs-toggle="pill"
                                href={`#nav-${h.key}`}
                                role="tab"
                                aria-controls={`nav-${h.key}`}
                                aria-selected={active === h.key}
                                onClick={e => {
                                    e.preventDefault();
                                    setActive(h.key);
                                }}
                            >
                                {h.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="tab-content" id={`navTabContent${id}`}>
                {React.Children.map(children, child =>
                    cloneElement(child, {
                        className: child.props.className + (active === child.props.eventKey ? ' show active' : '')
                    })
                )}
            </div>
        </div>
    );
};

TabPane.Pane = Pane;
export default TabPane;
