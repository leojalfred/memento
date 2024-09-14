import Entry from '@/components/timeline/Entry'
import type { Selection } from '@/types'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TimelineScreen() {
  const [isEditing, setIsEditing] = useState(false)
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable onPress={() => setIsEditing(false)} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 46 : 24}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 16,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Entry
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              selection={selection}
              setSelection={setSelection}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Pressable>
    </SafeAreaView>
  )
}
