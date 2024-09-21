import Entry from '@/components/timeline/Entry'
import type { Selection } from '@/types'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import OutsidePressHandler from 'react-native-outside-press'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TimelineScreen() {
  const insets = useSafeAreaInsets()
  const [isEditing, setIsEditing] = useState(false)
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 })

  const scrollY = useSharedValue(0)
  const scrollViewHeight = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-zinc-100 dark:bg-zinc-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 16 + insets.top,
          paddingBottom: 16 + insets.bottom,
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onContentSizeChange={(_, contentHeight) =>
          (scrollViewHeight.value = contentHeight)
        }
      >
        <OutsidePressHandler onOutsidePress={() => setIsEditing(false)}>
          <Entry
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            selection={selection}
            setSelection={setSelection}
            scrollY={scrollY}
          />
        </OutsidePressHandler>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  )
}
