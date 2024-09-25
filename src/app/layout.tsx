import styles from './globals.module.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${styles.body}`}>{children}</body>
    </html>
  );
}
