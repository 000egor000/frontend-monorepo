import { TaskPreset } from './presets/presetsReducer';

const mockPresets: TaskPreset[] = [
  { id: '1', name: 'preset 1' },
  { id: '2', name: 'preset 2' },
  { id: '3', name: 'preset 3' },
  { id: '4', name: 'preset 4' },
  { id: '5', name: 'preset 5' },
];

class MockService {
  private presets: TaskPreset[] = mockPresets;

  getPresets() {
    return this.presets;
  }
}

export default new MockService();
