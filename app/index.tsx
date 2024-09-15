import Entry from '@/components/timeline/Entry'
import type { Selection } from '@/types'
import { cssInterop } from 'nativewind'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

cssInterop(SafeAreaView, {
  className: {
    target: 'style',
  },
})

export default function TimelineScreen() {
  const [isEditing, setIsEditing] = useState(false)
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 })

  return (
    <SafeAreaView className="flex-1 bg-zinc-100 dark:bg-zinc-900">
      <Pressable className="flex-1" onPress={() => setIsEditing(false)}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 46 : 24}
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
