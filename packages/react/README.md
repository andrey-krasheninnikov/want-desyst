# @want-foundation/desyst-react

React 19 components built on Radix. Install @want-foundation/desyst-foundation at the same release version and import its stylesheet once. React and React DOM are peer dependencies.

Public exports include the UI primitives, BrandLogo, BrandLockup, MediaCard, ContactCard, ThemeToggle, CommentFeed, DateField, UrlField, OpenUrl and Window. Product data, labels, URLs and action callbacks belong to the consumer.

DateField uses controlled local date strings and consumer-provided locale and labels. UrlField validates its open link as HTTP(S). Window provides a page heading and content slots without application data.

See the repository README for usage, compatibility and release instructions.

CommentItem.createdAt accepts { dateTime, label }. Supply an ISO timestamp and a localized display label from the consumer. The component preserves that text during SSR and hydration.
