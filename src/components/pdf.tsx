'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Eye, FileText } from 'lucide-react'
import React from 'react'

interface PdfDialogViewerProps {
  pdfUrl: string
  triggerText?: string
  className?: string
  icon?: boolean
}

export function PdfDialogViewer({
  pdfUrl,
  triggerText = 'View PDF',
  icon = false,
}: PdfDialogViewerProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)

    if (!open) {
      // Close tooltip and blur after Radix returns focus to the trigger
      setTooltipOpen(false)
      requestAnimationFrame(() => triggerRef.current?.blur())
    }
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <Tooltip open={tooltipOpen} onOpenChange={() => {}}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            {!icon ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:underline p-0 cursor-pointer"
                type="button"
              >
                {triggerText}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-60 hover:opacity-100 transition-opacity"
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
                onFocus={() => setTooltipOpen(false)}
                type="button"
              >
                <Eye className="h-3.5 w-3.5  text-blue-500  " />
              </Button>
            )}
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>View</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="flex flex-col h-[calc(100vh-20px)] min-w-[80%]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {triggerText}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <iframe
            id="frame"
            src={pdfUrl}
            className="min-w-full h-full border-0 bg-white rounded shadow-sm"
            title={triggerText}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
