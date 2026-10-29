# @want-foundation/desyst-react

React 19 components built on Radix. Install @want-foundation/desyst-foundation at the same release version and import its stylesheet once. React and React DOM are peer dependencies.

Public exports include the UI primitives, BrandLogo, BrandLockup, MediaCard, ContactCard, ThemeToggle, CommentFeed, DateField, UrlField, OpenUrl and Window. Product data, labels, URLs and action callbacks belong to the consumer.

DateField uses controlled local date strings and consumer-provided locale and labels. UrlField validates its open link as HTTP(S). Window provides a page heading and content slots without application data.

See the repository README for usage, compatibility and release instructions.

CommentItem.createdAt accepts { dateTime, label }. Supply an ISO timestamp and a localized display label from the consumer. The component preserves that text during SSR and hydration.

Additional exports are Checkbox, DropdownMenu, Toast, Tooltip, Combobox, Popover, Table, Pagination, FileUpload and Progress. Menu, toast, tooltip, popover and table families expose their composition parts. Import the foundation stylesheet once for all component styles and motion.

Combobox accepts options with value, label and optional disabled, plus a controlled value and onValueChange. Supply label and emptyLabel. Typing filters options; arrows navigate enabled options, Enter selects, and Escape restores the current value. An optional name adds the selected value to native form data.

Pagination receives page, pageSize and totalItems. Its onChange(page, pageSize) callback reports navigation; changing page size resets the page to 1. Supply navigation, previous, next, pageSize, page(page) and results(from, to, total) labels. Empty results show page 1 with disabled navigation.

FileUpload receives files and onFilesChange, with optional accept, multiple, maxSize in bytes, maxFiles and disabled. Supply label and choose, drop, remove(name), invalidType(name), tooLarge(name, maxSize) and tooMany(maxFiles) labels. Invalid batches leave the current selection intact. Image previews release their object URLs when removed. Use the selected File objects for uploads in the consumer; the component does not submit a native file input or send network requests.

Progress requires a label and accepts value and max. A null value shows indeterminate progress. Table preserves native table semantics, caption and aria-busy; compose loading and empty rows with TableCell colSpan. ToastProvider and ToastViewport accept localized accessibility labels; ToastAction requires descriptive altText.

Typography exposes display, h1 through h6, lead, body, small, caption, label, overline, mono, code, code-block and quote variants. Its default HTML element follows the variant; as may override the element while keeping its visual style. tone and align use semantic colors and logical alignment. Prose styles native headings, paragraphs, lists, links, emphasis, quotes and code within a readable measure. Foundation tokens contain the responsive sizes, weights, leading and tracking. Sizes use rem and fluid viewport interpolation; locale fonts remain active.

Loader variants are spinner, dots, bars and orbit; sizes are sm, md and lg. Shimmer variants are block, text, avatar and card. Supply a localized label to each status component. Their paused prop stops repeated motion.

AnimatedText takes text and an optional fade, slide or blur effect. It animates a new value without timers or retained outgoing text. Set aria-live explicitly when the change needs an announcement.

Glow is a decorative, non-interactive background layer. Place it directly inside an element with className="glow-host"; the layer inherits the host radius. Use the normal style color or a text-color utility to change its hue. Two expanding waves run over a broad ambient halo, with a 3.6-second cycle and a 1.8-second offset. paused stops both waves. Expose a pause control for persistent decorative motion, and pause inactive surfaces. Reduced transparency preserves the waves. Reduced motion keeps a static glow; forced colors hide it.

Snackbar composes the existing Toast primitives. Supply variant (error, warning, info or success), a localized variantLabel, title and closeLabel; description and an action with label, altText and onClick are optional. Error messages remain until dismissed by default; other variants last 5 seconds. duration may override this. SnackbarProvider supplies the notification label; SnackbarViewport supplies the viewport label and supports placement through --snackbar-bottom. Pointer hover and keyboard focus pause timed messages. The surface follows the current theme, while the status icon plate uses the same accent in both themes. Desktop actions sit beside the content and move below it on narrow screens. The consumer owns open, onOpenChange and action effects. Importing the foundation stylesheet includes all visual styles and reduced-motion fallbacks. Use status-text tokens for inline colored text; status-foreground tokens are ink for the bright status surfaces.
