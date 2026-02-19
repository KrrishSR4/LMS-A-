import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnbivphcafkofmvgvymn.supabase.co';
const supabaseAnonKey = 'sb_publishable_aoLRsmDfLvxQtS4XfyYq5Q_IM4DhK7w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
