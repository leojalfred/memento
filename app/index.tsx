import Entry from '@/components/timeline/Entry'
import type { Selection } from '@/types'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import OutsidePressHandler from 'react-native-outside-press'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TimelineScreen() {
  const insets = useSafeAreaInsets()
  const [isEditing, setIsEditing] = useState(false)
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 })

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-zinc-100 dark:bg-zinc-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 16 + insets.top,
          paddingBottom: 16 + insets.bottom,
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <OutsidePressHandler onOutsidePress={() => setIsEditing(false)}>
          <Entry
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            selection={selection}
            setSelection={setSelection}
          />
        </OutsidePressHandler>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
