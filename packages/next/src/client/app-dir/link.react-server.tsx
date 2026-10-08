import type { ComponentProps } from 'react'
import ClientLinkComponent, { type LinkProps, useLinkStatus } from './link'

// The parts of a React element inspected below.
type ElementShape = { type?: unknown } | null | undefined
// A React element whose `type` is a client reference or a lazy component.
type ElementWithTaggedType =
  | { type?: { $$typeof?: unknown } | null }
  | null
  | undefined

export default function LinkComponent(
  props: ComponentProps<typeof ClientLinkComponent>
) {
  const isLegacyBehavior = props.legacyBehavior
  const childIsHostComponent =
    typeof props.children === 'string' ||
    typeof props.children === 'number' ||
    typeof (props.children as ElementShape)?.type === 'string'
  const childIsClientComponent =
    (props.children as ElementWithTaggedType)?.type?.$$typeof ===
    Symbol.for('react.client.reference')

  if (isLegacyBehavior && !childIsHostComponent && !childIsClientComponent) {
    if (
      (props.children as ElementWithTaggedType)?.type?.$$typeof ===
      Symbol.for('react.lazy')
    ) {
      console.error(
        `Using a Lazy Component as a direct child of \`<Link legacyBehavior>\` from a Server Component is not supported. If you need legacyBehavior, wrap your Lazy Component in a Client Component that renders the Link's \`<a>\` tag.`
      )
    } else {
      console.error(
        `Using a Server Component as a direct child of \`<Link legacyBehavior>\` is not supported. If you need legacyBehavior, wrap your Server Component in a Client Component that renders the Link's \`<a>\` tag.`
      )
    }
  }

  return <ClientLinkComponent {...props} />
}

export { type LinkProps, useLinkStatus }
