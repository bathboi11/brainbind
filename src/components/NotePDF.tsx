'use client';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
});

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter' },
  title: { fontSize: 32, color: '#a78bfa', marginBottom: 20, textAlign: 'center' },
  date: { fontSize: 12, color: '#94a3b8', textAlign: 'center', marginBottom: 40 },
  text: { fontSize: 14, lineHeight: 1.8 },
  footer: { position: 'absolute', bottom: 30, left: 40, fontSize: 10, color: '#64748b' }
});

export const NotePDF = ({ note }: any) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Brainbind Note</Text>
      <Text style={styles.date}>{format(new Date(note.created_at), 'PPPp')}</Text>
      <Text style={styles.text}>{note.summary}</Text>
      <Text style={styles.footer}>Made with Brainbind • brainbind.app</Text>
    </Page>
  </Document>
);