import unittest
import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.ensemble import IsolationForest

class TestCrimeVistaPipeline(unittest.TestCase):

    def setUp(self):
        """Set up mock data that simulates the Kaggle dataset before each test."""
        self.mock_data = pd.DataFrame({
            'Latitude': [12.9716, 12.9717, 12.9718, 15.0000, 18.0000], # First 3 are a cluster, last 2 are isolated
            'Longitude': [77.5946, 77.5947, 77.5948, 75.0000, 76.0000],
            'FIR_MONTH': [1, 1, 2, 5, 12],
            'VICTIM COUNT': [1, 0, 4, 1, 0],   # Index 2 has 4 victims (Rule-based anomaly)
            'Accused Count': [2, 1, 6, 1, 0],  # Index 2 has 6 accused (Rule-based anomaly)
            'District_Name': ['Bengaluru', 'Bengaluru', 'Bengaluru', 'Hubli', 'Belagavi']
        })

    # ==========================================
    # TESTS FOR TASK 1.1: DBSCAN CLUSTERING
    # ==========================================
   # ==========================================
    # TESTS FOR TASK 1.1: DBSCAN CLUSTERING
    # ==========================================
    def test_dbscan_logic(self):
        """Test if DBSCAN correctly identifies clusters vs noise."""
        coords = np.radians(self.mock_data[['Latitude', 'Longitude']].values)
        
        # FIXED: Changed 500 to 0.5 (representing 0.5 km or 500 meters)
        db = DBSCAN(eps=0.5/6371.0088, min_samples=2, algorithm='ball_tree', metric='haversine')
        labels = db.fit_predict(coords)
        
        # The first three points should form a cluster (label >= 0)
        self.assertTrue(labels[0] >= 0)
        self.assertTrue(labels[1] >= 0)
        
        # The last point is far away, should be noise (label == -1)
        self.assertEqual(labels[4], -1)
    # ==========================================
    # TESTS FOR TASK 1.2: ANOMALY DETECTION
    # ==========================================
    def test_rule_based_anomaly(self):
        """Test if the rule-based logic catches critical severity incidents."""
        def apply_rules(row):
            if row['VICTIM COUNT'] >= 3 or row['Accused Count'] >= 5:
                return True
            return False
            
        self.mock_data['Rule_Anomaly'] = self.mock_data.apply(apply_rules, axis=1)
        
        # Index 2 has 4 victims and 6 accused, must be True
        self.assertTrue(self.mock_data.loc[2, 'Rule_Anomaly'])
        # Index 0 has normal counts, must be False
        self.assertFalse(self.mock_data.loc[0, 'Rule_Anomaly'])

    def test_isolation_forest_execution(self):
        """Test if Isolation Forest initializes and predicts without crashing."""
        features = self.mock_data[['FIR_MONTH', 'VICTIM COUNT', 'Accused Count']]
        iso_forest = IsolationForest(contamination=0.2, random_state=42)
        predictions = iso_forest.fit_predict(features)
        
        # Ensure predictions are strictly 1 (normal) or -1 (anomaly)
        valid_labels = set(predictions)
        self.assertTrue(valid_labels.issubset({1, -1}))

    # ==========================================
    # TESTS FOR TASK 1.3: PREDICTIVE RISK SCORING
    # ==========================================
    def test_risk_assignment_thresholds(self):
        """Test if the dynamic percentile logic assigns risk categories properly."""
        district_stats = pd.DataFrame({
            'District_Name': ['A', 'B', 'C'],
            'Total_Crimes': [10, 50, 100]
        })
        
        low_thresh = district_stats['Total_Crimes'].quantile(0.33)
        high_thresh = district_stats['Total_Crimes'].quantile(0.66)
        
        def assign_risk(count):
            if count >= high_thresh:
                return 'High Risk'
            elif count >= low_thresh:
                return 'Medium Risk'
            else:
                return 'Low Risk'
                
        district_stats['Risk_Label'] = district_stats['Total_Crimes'].apply(assign_risk)
        
        self.assertEqual(district_stats.loc[0, 'Risk_Label'], 'Low Risk')
        self.assertEqual(district_stats.loc[2, 'Risk_Label'], 'High Risk')

if __name__ == '__main__':
    unittest.main()