<template>
  <div class="container">
    <h2>用户管理</h2>
    <Form ref="bookInfoInput" :model="bookInfoInput" inline>
      <span class="note">输入你希望查询的书籍信息（所有字段均可为空）</span>
      <FormItem prop="account">
        <Space direction="horizontal" type="flex" size="large">
          <Input type="text" v-model="bookInfoInput.name" clearable placeholder="书名" />
          <Input type="text" v-model="bookInfoInput.author" clearable placeholder="作者" />
          <Input type="text" v-model="bookInfoInput.attribute" clearable placeholder="属性" />
          <Input type="text" v-model="bookInfoInput.type" clearable placeholder="类型" />
          <Input type="text" v-model="bookInfoInput.pname" clearable placeholder="出版社" />
        </Space>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loading" @click="handleSubmit('bookInfoInput')">查找</Button>
      </FormItem>
    </Form>
    <Table stripe border height="550" :columns="columns" :data="currBooksInfo">
      <template #name="{ row }">
        <strong>{{ row.name }}</strong>
      </template>
      <template #action="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">查看</Button>
        <Button type="primary" size="small" @click="putCart(index)">加购</Button>
      </template>
    </Table>
    <Page :total="bookNum" :page-size="10" @on-change="changePage" show-total></Page>
  </div>
</template>

<script>
export default {

}
</script>