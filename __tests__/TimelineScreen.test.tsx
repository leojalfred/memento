import TimelineScreen from '@/app/index'
import { render } from '@testing-library/react-native'

describe('<TimelineScreen />', () => {
  it('renders correctly', () => {
    const tree = render(<TimelineScreen />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
