const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'sz123456',
  database: 'todolist_db'
});

async function testConnection() {
  try {
    console.log('=== 正在连接 PostgreSQL 数据库 ===');
    console.log('配置信息:');
    console.log('  Host:', 'localhost');
    console.log('  Port:', 5432);
    console.log('  User:', 'postgres');
    console.log('  Password:', 'sz123456');
    console.log('  Database:', 'todolist_db');
    console.log('\n连接中...');
    
    await client.connect();
    console.log('✅ 连接成功！');
    
    const result = await client.query('SELECT NOW()');
    console.log('📅 数据库时间:', result.rows[0].now);
    
    const tableExists = await client.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'todos')"
    );
    console.log('📋 todos 表是否存在:', tableExists.rows[0].exists);
    
    if (!tableExists.rows[0].exists) {
      console.log('\n📝 创建 todos 表...');
      await client.query(`
        CREATE TABLE todos (
          id SERIAL PRIMARY KEY,
          text VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT false
        )
      `);
      console.log('✅ todos 表创建成功！');
      
      console.log('\n📝 插入示例数据...');
      await client.query(`
        INSERT INTO todos (text, completed) VALUES 
        ('学习 React', false),
        ('学习 Express', false),
        ('创建 TodoList 项目', true)
      `);
      console.log('✅ 示例数据插入成功！');
    }
    
    console.log('\n📋 查询所有 Todo:');
    const todos = await client.query('SELECT * FROM todos');
    console.table(todos.rows);
    
    await client.end();
    console.log('\n✅ 测试完成！');
    
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
    process.exit(1);
  }
}

testConnection();