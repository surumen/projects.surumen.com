"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "../../hooks/useTiptapEditor"
import { 
  type BootstrapColor,
  type UseColorHighlightConfig,
  canColorHighlight,
  isColorHighlightActive,
  toggleColorHighlight,
  removeHighlight,
  shouldShowButton
} from "../../hooks/useColorHighlight"

// --- Icons ---
import { Eraser, Highlighter } from 'react-bootstrap-icons'

// --- UI Primitives ---
import { Popover, PopoverTrigger, PopoverContent } from "../../components/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from '@/widgets/tiptap';

// --- Types ---
export interface ColorHighlightPopoverProps extends Pick<UseColorHighlightConfig, "editor" | "hideWhenUnavailable" | "onToggled"> {
  colors?: BootstrapColor[]
  tooltip?: string
  showRemoveButton?: boolean
}

// --- Single Hook Managing Multiple Colors ---
function useMultiColorHighlight(colors: BootstrapColor[], editor: Editor | null, hideWhenUnavailable: boolean = false) {
  const [activeColors, setActiveColors] = React.useState<Set<BootstrapColor>>(new Set())
  const [isVisible, setIsVisible] = React.useState(true)

  // Memoize colors array to prevent infinite loops
  const memoizedColors = React.useMemo(() => colors, [colors.join(',')])

  // Single effect to track all colors efficiently
  React.useEffect(() => {
    if (!editor) {
      setActiveColors(new Set())
      setIsVisible(false)
      return
    }

    const updateState = () => {
      // Check which colors are active
      const active = new Set<BootstrapColor>()
      memoizedColors.forEach(color => {
        if (isColorHighlightActive(editor, color)) {
          active.add(color)
        }
      })
      setActiveColors(active)

      // Update visibility
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
    }

    updateState()
    
    // Single event listener for all colors
    editor.on('selectionUpdate', updateState)
    editor.on('transaction', updateState)

    return () => {
      editor.off('selectionUpdate', updateState)
      editor.off('transaction', updateState)
    }
  }, [editor, memoizedColors, hideWhenUnavailable])

  // Create color state objects
  const colorStates = React.useMemo(() => 
    memoizedColors.map(color => ({
      color,
      isActive: activeColors.has(color),
      canHighlight: canColorHighlight(editor),
      handleToggle: () => toggleColorHighlight(editor, color)
    })), [memoizedColors, activeColors, editor]
  )

  return {
    colorStates,
    isVisible,
    canHighlight: canColorHighlight(editor),
    hasAnyHighlight: activeColors.size > 0,
    handleRemoveHighlight: () => removeHighlight(editor)
  }
}

// --- Color Swatch Component ---
interface ColorSwatchProps {
  color: BootstrapColor
  isActive: boolean
  onToggle: () => void
  disabled?: boolean
}

const ColorSwatch = React.memo<ColorSwatchProps>(({ 
  color, 
  isActive, 
  onToggle, 
  disabled = false 
}) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    aria-label={`${color} highlight`}
    title={`Apply ${color} highlight`}
    className={`
      btn btn-sm p-0 position-relative rounded-circle bg-soft-${color}
      ${isActive ? 'border border-primary' : ''}
      ${disabled ? 'disabled' : ''}
    `}
    style={{ 
      minWidth: '1.5rem',
      minHeight: '1.5rem',
      transition: 'transform 0.1s ease-in-out'
    }}
  />
))

ColorSwatch.displayName = 'ColorSwatch'

// --- Main Component ---
export function ColorHighlightPopover({
  editor: providedEditor,
  hideWhenUnavailable = false,
  onToggled,
  colors = ["primary", "success", "warning", "danger", "info"],
  tooltip = "Highlight text",
  showRemoveButton = true
}: ColorHighlightPopoverProps) {
  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Use our single efficient hook
  const {
    colorStates,
    isVisible,
    hasAnyHighlight,
    handleRemoveHighlight
  } = useMultiColorHighlight(colors, editor, hideWhenUnavailable)

  // Handle trigger button click
  const handleTriggerClick = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setIsOpen(!isOpen)
  }, [isOpen])

  // Handle color toggle with callback
  const handleColorToggle = React.useCallback((toggleFn: () => boolean) => {
    const success = toggleFn()
    if (success) {
      setIsOpen(false)
      onToggled?.()
    }
  }, [onToggled])

  // Handle remove highlight
  const handleRemoveClick = React.useCallback(() => {
    const success = handleRemoveHighlight()
    if (success) {
      setIsOpen(false)
      onToggled?.()
    }
  }, [handleRemoveHighlight, onToggled])

  if (!isVisible) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleTriggerClick}
          title={tooltip}
          aria-label={tooltip}
          className='btn btn-sm btn-icon btn-ghost-secondary'
        >
          <Highlighter size={14} />
        </button>
      </PopoverTrigger>
      
      <PopoverContent aria-label="Highlight colors">
        <div className="row align-items-center col-sm-divider">
          <div className="col d-flex align-items-center gap-2">
            {colorStates.map(({ color, isActive, canHighlight, handleToggle }) => (
                <ColorSwatch
                    key={color}
                    color={color}
                    isActive={isActive}
                    onToggle={() => handleColorToggle(handleToggle)}
                    disabled={!canHighlight}
                />
            ))}
          </div>
          <div className="col-auto">
            <button
                type="button"
                onClick={handleRemoveClick}
                title="Remove highlight"
                aria-label="Remove highlight"
                className="btn btn-sm btn-icon btn-ghost-secondary rounded-circle"
                disabled={!hasAnyHighlight}
            >
              <Eraser size={14} />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ColorHighlightPopover