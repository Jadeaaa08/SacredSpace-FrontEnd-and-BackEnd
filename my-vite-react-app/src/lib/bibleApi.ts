export interface VerseResult {
  reference: string
  text: string
  translation: string
}

const mockVerseLibrary: Record<string, string> = {
  'john 3:16':
    'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
  'psalm 23:1':
    'The Lord is my shepherd; I shall not want.',
  'isaiah 40:31':
    'But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.',
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchVerse(reference: string): Promise<VerseResult> {
  await delay(450)
  const normalized = reference.trim().toLowerCase()
  const text = mockVerseLibrary[normalized] ??
    'A quiet passage is waiting. Please adjust the reference or continue with your own reflection.'
  return {
    reference: reference.trim() || 'Unnamed passage',
    text,
    translation: 'ESV',
  }
}
