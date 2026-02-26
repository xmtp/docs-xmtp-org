import { MDXProvider, useMDXComponents } from 'vocs/mdx-react';
import PageActions from './components/PageActions';
import TabSync from './components/TabSync';

export default function Layout({ children }: { children: React.ReactNode }) {
  const parentComponents = useMDXComponents();
  const OriginalH1 = parentComponents.h1 || 'h1';

  function H1WithActions(props: React.ComponentProps<'h1'>) {
    return (
      <>
        <OriginalH1 {...props} />
        <PageActions />
      </>
    );
  }

  return (
    <MDXProvider components={{ h1: H1WithActions }}>
      <TabSync />
      {children}
    </MDXProvider>
  );
}
