/* eslint-env jest */
import { render } from '@testing-library/react';
import VipLevelCard from '../../../packages/ui/src/VipLevelCard';

describe('VipLevelCard', () => {
  it('renders with vip level', () => {
    render(<VipLevelCard level={5} />);
  });
});
