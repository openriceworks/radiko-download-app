import { FluentProvider, webLightTheme } from '@fluentui/react-components'

/**
 * fluentuiのコンポーネントをstorybookで使えるようにするHelperコンポーネント
 * @param Story 
 * @returns 
 */
export function DecoratorsHelper(Story: () => JSX.Element): JSX.Element {
  return (
    <FluentProvider theme={webLightTheme}>
      <Story />
    </FluentProvider>
  )
}