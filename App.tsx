
import React, { useState, useEffect, useCallback } from 'react';
import { View, Grade, TestType, TestData, StudentResult, UserRole } from './types';
import Sidebar from './components/Sidebar';
import TeacherDashboard from './components/TeacherDashboard';
import TestGenerator from './components/TestGenerator';
import StudentPortal from './components/StudentPortal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RoleSelector from './components/RoleSelector';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
  const [currentView, setCurrentView] = useState<View>(View.TEACHER_DASHBOARD);
  
  const [activeTest, setActiveTest] = useState<TestData | null>(() => {
    const saved = localStorage.getItem('activeTest');
    return saved ? JSON.parse(saved) : null;
  });

  const [results, setResults] = useState<StudentResult[]>(() => {
    const saved = localStorage.getItem('results');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'results' && e.newValue) {
        setResults(JSON.parse(e.newValue));
      }
      if (e.key === 'activeTest' && e.newValue) {
        setActiveTest(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTest', JSON.stringify(activeTest));
  }, [activeTest]);

  useEffect(() => {
    localStorage.setItem('results', JSON.stringify(results));
  }, [results]);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.STUDENT) {
      setCurrentView(View.STUDENT_PORTAL);
    } else {
      setCurrentView(View.TEACHER_DASHBOARD);
    }
  };

  const handleTestGenerated = (test: TestData) => {
    const newTest = {
      ...test,
      isPublished: false
    };
    setActiveTest(newTest);
    setCurrentView(View.TEACHER_DASHBOARD);
  };

  const handleTogglePublish = () => {
    if (activeTest) {
      const updatedTest = { ...activeTest, isPublished: !activeTest.isPublished };
      setActiveTest(updatedTest);
    }
  };

  const handleStudentSubmit = useCallback((result: StudentResult) => {
    setResults(prev => {
      const newResults = [...prev, result];
      localStorage.setItem('results', JSON.stringify(newResults));
      return newResults;
    });
  }, []);

  const handleLogout = () => {
    setUserRole(UserRole.NONE);
  };

  if (userRole === UserRole.NONE) {
    return <RoleSelector onSelect={handleRoleSelect} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        userRole={userRole} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto w-full">
          {userRole === UserRole.TEACHER && (
            <>
              {currentView === View.TEACHER_DASHBOARD && (
                <TeacherDashboard 
                  activeTest={activeTest} 
                  resultsCount={results.length} 
                  onCreateClick={() => setCurrentView(View.CREATE_TEST)}
                  onTogglePublish={handleTogglePublish}
                  onDeleteTest={() => {
                    if(confirm("Bạn có chắc muốn xóa đề này?")) {
                      setActiveTest(null);
                    }
                  }}
                />
              )}
              {currentView === View.CREATE_TEST && (
                <TestGenerator onGenerated={handleTestGenerated} />
              )}
              {currentView === View.ANALYTICS && (
                <AnalyticsDashboard results={results} test={activeTest} />
              )}
            </>
          )}

          {currentView === View.STUDENT_PORTAL && (
            <StudentPortal 
              test={activeTest} 
              onSubmit={handleStudentSubmit} 
              results={results}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
