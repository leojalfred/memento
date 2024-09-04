import Entry from '@/components/timeline/Entry'
import { useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export interface Selection {
  start: number
  end: number
}

export default function TimelineScreen() {
  const [isEditing, setIsEditing] = useState(false)
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable onPress={() => setIsEditing(false)} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <Entry
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            selection={selection}
            setSelection={setSelection}
          />
        </ScrollView>
      </Pressable>
    </SafeAreaView>
  )
}
