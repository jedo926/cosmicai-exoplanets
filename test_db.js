require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY ? `${SUPABASE_KEY.substring(0, 20)}...` : 'MISSING');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  try {
    console.log('\n1. Testing SELECT query...');
    const { data: selectData, error: selectError } = await supabase
      .from('exoplanets')
      .select('*')
      .limit(5);

    if (selectError) {
      console.error('SELECT Error:', selectError);
    } else {
      console.log(`✓ Successfully fetched ${selectData.length} planets`);
      console.log('Sample:', selectData[0]);
    }

    console.log('\n2. Testing INSERT query...');
    const testPlanet = {
      planet_name: `TEST-${Date.now()}`,
      host_star: 'Test Star',
      period: 123.45,
      radius: 1.5,
      depth: 1000,
      classification: 'Candidate Planet',
      probability: 0.8,
      discovery_date: new Date().toISOString(),
      dataset: 'test'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('exoplanets')
      .insert([testPlanet])
      .select();

    if (insertError) {
      console.error('INSERT Error:', insertError);
    } else {
      console.log('✓ Successfully inserted test planet:', insertData[0]);

      // Clean up test data
      const { error: deleteError } = await supabase
        .from('exoplanets')
        .delete()
        .eq('planet_name', testPlanet.planet_name);

      if (!deleteError) {
        console.log('✓ Cleaned up test data');
      }
    }

    console.log('\n✅ Database connection is working!');
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
