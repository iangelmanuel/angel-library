import { useEffect, useState, type CSSProperties } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { ChevronRight, X } from "lucide-react"
import { DynamicIcon } from "@/components/shared/DynamicIcon"
import type { NavData } from "@/lib/nav"

export default function MobileNav({ data }: { data: NavData }) {
  const [open, setOpen] = useState(false)
  const [activePath, setActivePath] = useState("")

  useEffect(() => {
    const toggle = () => {
      setActivePath(window.location.pathname.replace(/\/+$/, "") || "/")
      setOpen((value) => !value)
    }
    window.addEventListener("angel:toggle-nav", toggle)
    return () => window.removeEventListener("angel:toggle-nav", toggle)
  }, [])

  const isActive = (url: string) =>
    (url.replace(/\/+$/, "") || "/") === activePath
  const close = () => setOpen(false)

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={setOpen}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          aria-label="Menú de navegación"
        >
          <DialogPrimitive.Title className="sr-only">
            Navegación
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Menú con categorías, documentación y acceso a la búsqueda.
          </DialogPrimitive.Description>

          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <span className="font-pixel text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              menú
            </span>
            <DialogPrimitive.Close
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Cerrar menú"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-3 py-4"
            aria-label="Navegación móvil"
          >
            <button
              type="button"
              onClick={() => {
                close()
                window.dispatchEvent(new CustomEvent("angel:open-search"))
              }}
              className="mb-4 flex w-full items-center gap-2 border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              <span
                className="font-mono font-semibold text-[var(--accent-green)]"
                aria-hidden="true"
              >
                $
              </span>
              <span className="flex-1 text-left">grep docs</span>
              <kbd className="kbd">/</kbd>
            </button>

            <div className="flex flex-col gap-0.5 pb-4">
              <a
                href="/"
                className="nav-link"
                onClick={close}
              >
                <DynamicIcon
                  name="home"
                  className="size-3.5 text-[var(--accent-blue)]"
                />{" "}
                Inicio
              </a>
              <a
                href="/tags"
                className="nav-link"
                onClick={close}
              >
                <DynamicIcon
                  name="tags"
                  className="size-3.5 text-[var(--accent-yellow)]"
                />{" "}
                Tags
              </a>
            </div>

            {data.groups.map((group) => (
              <section
                key={group.id}
                className="nav-group"
              >
                {group.categories.map((category) => {
                  const subgroups =
                    category.resourceGroups ?? category.stackGroups ?? []
                  const groupedItems = [
                    ...subgroups.flatMap((sub) => sub.items),
                    ...category.items
                  ]
                  const containsActive = groupedItems.some((item) =>
                    isActive(item.url)
                  )

                  return (
                    <details
                      key={category.id}
                      className="nav-cat"
                      open={containsActive}
                      style={
                        {
                          "--cat-accent": `var(${category.color})`
                        } as CSSProperties
                      }
                    >
                      <summary className="nav-summary">
                        <DynamicIcon
                          name={category.icon}
                          className="nav-icon nav-icon--cat"
                        />
                        <span className="nav-summary__label">
                          {category.label}
                        </span>
                        <ChevronRight className="nav-chevron" />
                      </summary>

                      <div className="nav-children">
                        {subgroups.map((sub) => (
                          <details
                            key={sub.id}
                            className="nav-sub"
                            open={sub.items.some((item) => isActive(item.url))}
                          >
                            <summary className="nav-summary nav-summary--sub">
                              <span className="nav-summary__label">
                                {sub.label}
                              </span>
                              <ChevronRight className="nav-chevron" />
                            </summary>
                            <div className="nav-children nav-children--deep">
                              {sub.items.map((item) => (
                                <a
                                  key={item.url}
                                  href={item.url}
                                  className={`nav-link${isActive(item.url) ? " is-active" : ""}`}
                                  aria-current={
                                    isActive(item.url) ? "page" : undefined
                                  }
                                  onClick={close}
                                >
                                  <span className="nav-link__label">
                                    {item.title}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </details>
                        ))}

                        {category.items.map((item) => (
                          <a
                            key={item.url}
                            href={item.url}
                            className={`nav-link nav-link--loose${isActive(item.url) ? " is-active" : ""}`}
                            aria-current={
                              isActive(item.url) ? "page" : undefined
                            }
                            onClick={close}
                          >
                            <DynamicIcon
                              name={item.icon}
                              className="nav-icon"
                            />
                            <span className="nav-link__label">
                              {item.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </details>
                  )
                })}
              </section>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
