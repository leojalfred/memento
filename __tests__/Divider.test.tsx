import Divider from '@/components/Divider'
import { render } from '@testing-library/react-native'

describe('<Divider />', () => {
  it('renders correctly', () => {
    const tree = render(<Divider />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
