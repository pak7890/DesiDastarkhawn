
export enum Cuisine {
  INDIAN = 'Indian',
  AFGHANI = 'Afghani',
  PAKISTANI = 'Pakistani',
  CHINESE = 'Chinese',
  ARABIAN = 'Arabian',
  ENGLISH = 'English',
  ALL = 'All'
}

export type Language = 'en' | 'ur' | 'roman';

export type MeatType = 'Chicken' | 'Mutton' | 'Beef' | null;
export type MeatWeight = '0.5kg' | '1kg' | '1.5kg' | '2kg' | null;
export type CuisineType = 'Desi' | 'Chinese' | 'Arabian' | 'English';
export type DietMode = 'Standard' | 'LowCarb';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinedDate: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface AppSettings {
  adsEnabled: boolean;
  googleAdsClientId: string;
  adSlots: {
    leaderboard: string;
    sidebar: string;
    content: string;
  };
  maintenanceMode: boolean;
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export interface Macros {
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
}

export interface Ingredient {
  name_en: string;
  name_ur: string;
  name_roman: string;
  quantity_en: string;
  quantity_ur: string;
  quantity_roman: string;
  calories: number; // Total calories for this quantity in the recipe
}

export interface Recipe {
  id: string;
  title_en: string;
  title_ur: string;
  title_roman: string;
  description_en: string;
  description_ur: string;
  description_roman: string;
  
  // Structured Ingredients
  ingredients: Ingredient[];

  instructions_en: string[];
  instructions_ur: string[];
  instructions_roman: string[];
  cuisine: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  servings: number; // Number of servings generated
  servingSizeGrams: number; // Weight of single serving
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number; // Calories per single serving (Calculated or from API)
  macros: Macros; // Macros per single serving
  tips_en: string[];
  tips_ur: string[];
  tips_roman: string[];
  imageUrl?: string;
  meatWeightUsed?: string; // To display what weight was used for generation
}

// Updated Response to handle list of matches
export interface RecipeResponse {
  query: string;
  matched_recipes: Recipe[];
}

export interface RecipeState {
  data: RecipeResponse | null;
  loading: boolean;
  imageLoading: boolean;
  error: string | null;
}

// --- Diet Planner Types ---

export type DietPatternType = 'IF' | 'OMAD' | 'Standard';
export type IFWindow = '16:8' | '18:6' | '20:4' | 'Custom';
export type MacroPresetType = 'Keto' | 'LowCarb' | 'HighProtein' | 'HighCarb' | 'Custom';

export interface DietPlannerInputs {
  calories: number;
  cuisinePreference: string;
  patternType: DietPatternType;
  ifWindow?: IFWindow;
  omadTime?: string;
  mealsCount?: number;
  macroType: MacroPresetType;
  customMacros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface MultilingualText {
  en: string;
  ur: string;
  roman_ur: string;
}

export interface DietIngredient {
  name_en: string;
  name_ur: string;
  name_roman_ur: string;
  quantity: number;
  unit: string;
  calories: number;
  carbs_g?: number;
  protein_g?: number;
  fat_g?: number;
}

export interface DietRecipe {
  steps_en: string[];
  steps_ur: string[];
  steps_roman_ur: string[];
  estimated_cook_time_min: number;
  notes_en?: string;
  notes_ur?: string;
  notes_roman_ur?: string;
}

export interface DietMealOption {
  option_id: string;
  titles: MultilingualText;
  descriptions: MultilingualText;
  approx_calories: number;
  macros: {
    carbs_g: number;
    protein_g: number;
    fat_g: number;
  };
  ingredients: DietIngredient[];
  recipe: DietRecipe;
}

export interface DietMealSlot {
  meal_id: string;
  meal_label: string; // "Lunch"
  planned_time: string;
  calories_target: number;
  macro_target: {
    carbs_g: number;
    protein_g: number;
    fat_g: number;
  };
  options: DietMealOption[];
}

export interface DietPlanResponse {
  summary: {
    date: string;
    total_daily_calories: number;
    total_meals_planned: number;
    eating_pattern_label: string;
    macro_distribution_percent: {
      carbs: number;
      protein: number;
      fat: number;
    };
  };
  meals: DietMealSlot[];
  totals: {
    planned_calories: number;
    calories_remaining_for_day: number;
    planned_macros: {
      carbs_g: number;
      protein_g: number;
      fat_g: number;
    };
  };
  messages_for_user: string[];
}

export interface FeedbackContext {
  is_feedback_mode: boolean;
  target_meal_id?: string | null;
  target_option_id?: string | null;
  feedback_text?: string | null;
  user_change_requests?: {
    avoid_foods?: string[];
    add_ingredients?: string[];
    remove_ingredients?: string[];
  };
}
