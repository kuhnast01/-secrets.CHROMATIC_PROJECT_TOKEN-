import { render } from '@testing-library/react';
import AdminPanelHome from '../src/app/page';

describe('Admin Panel Smoke Test', () => {
  it('renders main app component without crashing', () => {
    const { container } = render(<AdminPanelHome />);
    expect(container).toBeDefined();
  });
});
