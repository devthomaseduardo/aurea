import { localStore } from '@/core/storage/local-storage';
import type {
  PluginConnection,
  PluginDefinition,
  PluginRuntime,
} from '@/types/plugins';
import { isCloudDataEnabled } from '@/core/db/mode';
import {
  listCollection,
  setDocument,
} from '@/core/firebase/user-repo';
