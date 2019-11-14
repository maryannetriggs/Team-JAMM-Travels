from rest_framework import serializers
from .models import Blog, BlogImage, Comment, Tag

class NestedBlogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = ('id', 'title', 'subtitle', 'author', 'date_published', 'story')

class NestedBlogImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlogImage
        fields = ('id', 'image')

class NestedTagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'tag')

class NestedCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'comment', 'date')

class TagSerializer(serializers.ModelSerializer):

    blogs = NestedBlogSerializer(many=True)

    class Meta:
        model = Tag
        fields = ('id', 'tag', 'blogs')

class CommentSerializer(serializers.ModelSerializer):

    blogs = NestedBlogSerializer(many=True)

    class Meta:
        model = Comment
        fields = ('id', 'comment', 'blogs')

class BlogImageSerializer(serializers.ModelSerializer):

    blogs = NestedBlogSerializer(many=True)

    class Meta:
        model = BlogImage
        fields = ('id', 'image', 'blogs')

class BlogSerializer(serializers.ModelSerializer):

    tags = NestedTagSerializer(many=True)
    images = NestedBlogImageSerializer(many=True)
    comments = NestedCommentSerializer(many=True)

    def create(self, data):
        tags_data = data.pop('tags')
        images_data = data.pop('images')
        comments_data = data.pop('comments')

        blog = Blog(**data)
        tags = [Tag.objects.get(**tag_data) for tag_data in tags_data]
        images = [Image.objects.get(**image_data) for image_data in images_data]
        comments = [Comment.objects.get(**comment_data) for comment_data in comments_data]
        blog.save()
        blog.tags.set(tags)
        blog.images.set(images)
        blog.comments.set(comments)
        return blog

    def update(self, blog, data):
        tags_data = data.pop('tags')
        images_data = data.pop('images')
        comments_data = data.pop('comments')

        blog.title = data.get('title', blog.title)
        blog.subtitle = data.get('subtitle', blog.subtitle)
        blog.author = data.get('author', blog.author)
        blog.date_published = data.get('date_published', blog.date_published)
        blog.story = data.get('story', blog.story)

        tags = [Tag.objects.get(**tag_data) for tag_data in tags_data]
        images = [Image.objects.get(**image_data) for image_data in images_data]
        comments = [Comment.objects.get(**comment_data) for comment_data in comments_data]

        blog.save()
        blog.tags.set(tags)
        blog.images.set(images)
        blog.comments.set(comments)
        return blog

    class Meta:

        model = Blog
        fields = ('id', 'title', 'subtitle', 'author', 'date_published', 'story', 'images', 'tags', 'comments')
