import Entry from '@/components/timeline/Entry'
import { useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export interface Selection {
  start: number
  end: number
}

export default function TimelineScreen() {
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 })

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
        setSelection({ start: 0, end: 0 })
      }}
      accessible={false}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View className="p-4">
          <Entry selection={selection} setSelection={setSelection} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
