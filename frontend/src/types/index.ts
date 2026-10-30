// Types for the VERYNTH application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repository_url: string;
  language: string;
  framework: string;
  status: 'active' | 'analyzing' | 'migrating' | 'completed';
  created_at: string;
  updated_at: string;
  dependency_count: number;
  outdated_count: number;
  risk_score: number;
}

export interface Dependency {
  id: string;
  name: string;
  current_version: string;
  latest_version: string;
  target_version?: string;
  status: 'up_to_date' | 'outdated' | 'vulnerable' | 'migrating' | 'migrated';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  breaking_changes: number;
  affected_files: number;
  changelog_url?: string;
}

export interface Migration {
  id: string;
  project_id: string;
  project_name: string;
  dependency_name: string;
  from_version: string;
  to_version: string;
  status: 'pending' | 'analyzing' | 'generating' | 'testing' | 'review' | 'approved' | 'failed';
  progress: number;
  created_at: string;
  completed_at?: string;
  ai_confidence: number;
  files_changed: number;
  tests_passed: number;
  tests_total: number;
}

export interface MigrationDetail extends Migration {
  changes: FileChange[];
  ai_reasoning: string[];
  risks: Risk[];
  activity_log: ActivityEvent[];
  test_results: TestResult[];
}

export interface FileChange {
  file_path: string;
  original_content: string;
  proposed_content: string;
  change_type: 'modified' | 'added' | 'deleted';
  hunks: number;
}

export interface Risk {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
  affected_files: string[];
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'ai';
  message: string;
  details?: string;
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'running';
  duration_ms: number;
  error_message?: string;
}

export interface DashboardMetrics {
  total_projects: number;
  active_migrations: number;
  dependencies_updated: number;
  ai_confidence_avg: number;
  risk_reduction: number;
  tests_passing_rate: number;
}

export interface VerificationResult {
  id: string;
  migration_id: string;
  status: 'running' | 'passed' | 'failed' | 'partial';
  test_results: TestResult[];
  coverage: number;
  duration_ms: number;
  started_at: string;
  completed_at?: string;
}
