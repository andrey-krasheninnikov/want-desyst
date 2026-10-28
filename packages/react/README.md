# @want-desyst/react

React 19 components built on Radix. Install @want-desyst/foundation at the same release version and import its stylesheet once. React and React DOM are peer dependencies.

Public exports include the UI primitives, BrandLogo, BrandLockup, MediaCard, ContactCard, ThemeToggle and CommentFeed. Product data, labels, URLs and action callbacks belong to the consumer.

See the repository README for usage, compatibility and release instructions.

CommentItem.createdAt accepts { dateTime, label }. Supply an ISO timestamp and a localized display label from the consumer. The component preserves that text during SSR and hydration.
